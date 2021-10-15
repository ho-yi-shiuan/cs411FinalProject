const pool = require("./index");
const userQuery = require("../query/user");
let SqlString = require('sqlstring');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const getUserProfile = async(userToken) => {
    return new Promise(async function(resolve, reject) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try{
			const now = Date.now();
            //search for user data, location, all pet own by user with token
            const user = await connection.execute(userQuery.getUserProfile,[userToken]);
            if(user[0].length == 0){
                //if no result, return token wrong, redirect to signin page
                await connection.commit(); 
                resolve({
                code: 200,
                data: {UserProfile: "tokenWrong"}
                })	
            }else if(now >= user[0][0].access_expired){
                //else if result exist but token expired
                await connection.commit();
                resolve({
                code: 200,
                data: {UserProfile: "tokenExpired"}
                })
            }
            //else, return result
            //think how to get user info with location and pet list with location in one query
            // let userInformation = {
            //     email: user[0][0].email,
            //     name: user[0][0].firstName+ " " +user[0][0].lastName,
            //     phone: user[0][0].phone,
            //     zip_code: user[0][0].zip_code,
            //     userID: user[0][0].user_id,
            //     access_token: user[0][0].access_token,
            //     access_expired: user[0][0].access_expired,
            //     zipCode: user[0][0].,
            //     city: user[0][0].,
            //     state: user[0][0].,
            //     latitude: user[0][0].,
            //     longitude: user[0][0].                           
            // }
            //let userPetList = []
            await connection.commit(); 
            resolve({
              code: 200,
              data: {UserProfile: user[0]}
            })
        }catch(err){
            console.log("error in signin:");
            console.log(err);
            await connection.rollback(function(){
                connection.release();
                res.status(500).send({error:"db query error in get user profile"});
            })
        }
    });
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
                resolve({
                  code: 200,
                  data: {signupStatus: "exist"}
                })
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
                        signupStatus: "success",
                        user: user_data
                    }
            })
        }catch(err){
            console.log("error in signup:");
            console.log(err);
            await connection.rollback(function(){
                connection.release();
                res.status(500).send({error:"db query error in signup"});
            })
        }
  });
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
                await connection.commit(); 
                resolve({
                code: 200,
                data: {signupStatus: "unknownAccount"}
                })
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
                        res.status(401).send({error:"Update user token Error"});
                    });            
                }
                //return updated user info and new token
                let user_data = {
                    email: userList[0][0].email,
                    name: userList[0][0].firstName+ " " +userList[0].lastName,
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
                            signupStatus: "success",
                            user: user_data
                        }
                })            
            }else{
                //password incorrect, rollback
                await connection.commit(); 
                resolve({
                code: 200,
                data: {signupStatus: "passwordIncorrect"}
                })
            }
        }catch(err){
            console.log("error in signin:");
            console.log(err);
            await connection.rollback(function(){
                connection.release();
                res.status(500).send({error:"db query error in signin"});
            })
        }
    });
}

module.exports = {
    getUserProfile,
    signup,
    signin
}