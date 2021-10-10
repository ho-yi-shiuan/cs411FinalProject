const pool = require("./index");
const userQuery = require("../query/user");

const getUserProfile = async(user_id) => {
    const result = await pool.execute(userQuery.profile, [user_id]);
    const user = result[0];
    if(user.length == 0){
        return {
            code: 401,
            data: {message: "redirect to signin page"}
        }
    }
    return {
        code: 200,
        data: {user:user[0]}
    }
}

module.exports = {
    getUserProfile
}