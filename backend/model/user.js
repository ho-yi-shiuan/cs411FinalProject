const pool = require("./index");
const userQuery = require("../query/user");
let SqlString = require('sqlstring');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const date = require('date-and-time');

const getUserProfile = async(userToken) => {
    return new Promise(async function(resolve, reject) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try{
			const now = Date.now();
            //search for user data, location, all pet own by user with token
            const user = await connection.query(userQuery.getUserProfile,[userToken]);
            if(user[0][0].length == 0){
                //if no result, return token wrong, redirect to signin page
                let err = new Error('token incorrect');
                err.statusCode = 401;
                throw err;
            }else if(now >= user[0][0].access_expired){
                //else if result exist but token expired
                let err = new Error('token expired');
                err.statusCode = 401;
                throw err;
            }
            //else, return result with pet record own by user
            const userPetList = await connection.query(userQuery.getUserPet,[user[0][0].user_id]);
            for(i=0;i<userPetList[0].length;i++){
                userPetList[0][i].date = date.format(userPetList[0][i].date, "YYYY/MM/DD");
            }
            let userInformation = {
                email: user[0][0].email,
                name: user[0][0].first_name+ " " +user[0][0].last_name,
                phone: user[0][0].phone,
                zip_code: user[0][0].zip_code,
                userID: user[0][0].user_id,
                access_token: user[0][0].access_token,
                access_expired: user[0][0].access_expired,
                city: user[0][0].city,
                state: user[0][0].state,
                latitude: user[0][0].latitude,
                longitude: user[0][0].longitude,
                pet:userPetList[0]
            }
            await connection.commit(); 
            resolve({
              code: 200,
              data: {UserProfile: userInformation}
            })
        }catch(err){
            await connection.rollback();
            if (err.statusCode == 401){
                reject ({
                    code: 401,
                    data: {error:err.message}
                })
            }
            console.log(err);
            reject ({
                code: 500,
                data: {error:"server error in get user profile"}
            })
        }finally {
            connection.release();
        }
    }).catch(err =>{
        console.log("error in get user profile: "+err.data.error);
        return err;
    })
}

const signup = (user) => {
    return new Promise(async function(resolve, reject) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try{
            //check if email already exist
            const userList = await connection.execute(userQuery.checkUserExist,[user.email]);
            if(userList[0].length > 0){
                //if exist, show message to tell user switch to login page
                await connection.commit();
                let err = new Error('user exist');
                err.statusCode = 409;
                throw err;
            }
            //if not exist, start to signup
            //create token
            let date = Date.now();
            let hash = crypto.createHash('sha256');
            hash.update(user.email+date);
            const token = hash.digest('hex');
            let time = 3600000;
            let expire = parseInt(date+time);
            //hash password
            const salt_rounds = 10;
            const bcrypt_promise = new Promise((resolve, reject) => {
                const hash = bcrypt.hashSync(user.password, salt_rounds);
                resolve(hash);
            })
            let bcrypt_password = await bcrypt_promise;
            //insert user signup data
            let signup_data = [user.email, bcrypt_password, user.firstName, user.lastName, user.phone, user.zip_code, token, expire]
            const insertUser = await connection.execute(userQuery.insertUser,signup_data);
            let user_data = {
                email: user.email,
                name: user.firstName+ " " +user.lastName,
                phone: user.phone,
                zip_code: user.zip_code,
                userID: insertUser[0].insertId,
                access_token: token,
                access_expired: expire
            }
            await connection.commit(); 
            resolve({
                code: 200,
                data: {
                        user: user_data
                    }
            })
        }catch(err){
            console.log(err);
            await connection.rollback();
            if (err.statusCode == 409){
                reject ({
                    code: 409,
                    data: {error:err.message}
                })
            }
            reject ({
                code: 500,
                data: {error:"server error in signup"}
            })
        }finally {
            connection.release();
        }
    }).catch(err =>{
        console.log("error in signup: "+err.data.error);
        return err;
    })
}

const signin = (user) => {
    return new Promise(async function(resolve, reject) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try{
            //search user with email
            const userList = await connection.execute(userQuery.checkUserExist,[user.email]);
            if(userList[0].length == 0){
                //if no, return no user
                let err = new Error('Email incorrect');
                err.statusCode = 401;
                throw err;
            }
            //if yes, check if password is correct
            const comparePassword = await bcrypt.compare(user.password, userList[0][0].password);
            if(comparePassword){
                //password correct, create new token
                let date = Date.now();
                let hash = crypto.createHash('sha256');
                hash.update(user.email+date);
                const token = hash.digest('hex');
                let time = 3600000;
                let expire = parseInt(date+time);
                //update token in db
                let newToken = {
                    access_token:token,
                    access_expired:expire
                }
                const updateUser = await connection.query(userQuery.updateToken,[newToken,userList[0][0].user_id]);
                if(updateUser[0].length == 0){
                    await connection.rollback(function(){
                        console.log("error in updateUserToken function");
                        console.log(err);
                        connection.release();
                        let err = new Error('Update user token Error');
                        throw err;
                    });            
                }
                //return updated user info and new token
                let user_data = {
                    email: userList[0][0].email,
                    name: userList[0][0].first_name+ " " +userList[0][0].last_name,
                    phone: userList[0][0].phone,
                    zip_code: userList[0][0].zip_code,
                    user_id: userList[0][0].user_id,
                    access_token: token,
                    access_expired: expire
                }
                await connection.commit(); 
                resolve({
                    code: 200,
                    data: {
                            user: user_data
                        }
                })
            }else{
                //password incorrect, rollback
                let err = new Error('Password incorrect');
                err.statusCode = 401;
                throw err;
            }
        }catch(err){
            await connection.rollback();
            if (err.statusCode == 401){
                reject ({
                    code: 401,
                    data: {error:err.message}
                })
                //res.status(401).send({ error: err.message });
            }
            reject ({
                code: 500,
                data: {error:"server error in signin"}
            })
        }finally {
            connection.release();
        }
    }).catch(err =>{
        console.log("error in signin: "+err.data.error);
        return err;
    })
}

module.exports = {
    getUserProfile,
    signup,
    signin
}