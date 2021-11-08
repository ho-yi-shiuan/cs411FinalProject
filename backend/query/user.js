const getUserProfile = `
    SELECT u.user_id, u.email, u.first_name, u.last_name, u.phone, u.zip_code, u.access_token, u.access_expired, l.city, l.state
    FROM USER u
    JOIN ZIPCODE l ON l.zip_code = u.zip_code
    WHERE access_token = ?;
`

const getUserPet = `
    SELECT p.*, l.* 
    FROM PET p
    JOIN ZIPCODE l ON l.zip_code = p.zip_code
    WHERE p.contact = ?
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
    getUserPet,
    checkUserExist,
    insertUser,
    updateToken
}