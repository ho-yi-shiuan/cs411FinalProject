const getUserProfile = `
    SELECT u.*, p.*, l.*
    FROM USER u
    LEFT JOIN PET p ON p.contact = u.user_id
    LEFT JOIN ZIPCODE l ON l.zipCode = u.zip_code
    WHERE access_token = ?;
`

const checkUserExist = `
    SELECT * FROM USER WHERE email = ?;
`

const insertUser = ` 
    INSERT INTO USER(email, password, first_name, last_name, phone, zip_code, access_token, access_expired) 
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?);
`

const updateToken = ` 
    UPDATE USER SET ? WHERE user_id = ?;
` 

module.exports = {
    getUserProfile,
    checkUserExist,
    insertUser,
    updateToken
}