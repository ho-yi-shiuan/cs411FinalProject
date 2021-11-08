const AllPets = `
    SELECT * FROM PET
    LEFT JOIN ZIPCODE ON ZIPCODE.zip_code = PET.zip_code;
`;
const findBreed = `
    SELECT bid FROM BREED 
    WHERE breed_name = ? AND category = ?;
`;

const InsertPet = `
    INSERT INTO PET(contact, status, date, picture, name, bid, category, age, color, size, gender, chip_status, injured_flag, zip_code, mark_solved) 
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
const InsertHas = `
    INSERT INTO Has (pet_id, health_id) VALUES ?;
`;

const deletePet = `
    DELETE FROM PET 
    WHERE pet_id = ?;
`;

const updatePet = ` 
    UPDATE PET
    SET date = ?, name = ?, category = ?, age = ?, size = ?, gender = ?, chip_status = ?, zip_code = ?
    WHERE pet_id = ?;
`;

const showCountOfLostAfter2019 = ` 
    SELECT state, category, COUNT(pet_id) AS LostPetCount
    FROM PET 
    NATURAL JOIN BREED 
    NATURAL JOIN ZIPCODE
    WHERE status = 'lost' 
    AND year(date) > 2019
    GROUP BY state, category
    ORDER BY COUNT(pet_id) DESC;
` 

const showCatCommonHealthIssue = `  
SELECT category, breed_name, medical_conditions, COUNT(health_id) AS CountofIllness
FROM PET NATURAl JOIN Has
NATURAL JOIN HEALTH_ISSUE
NATURAL JOIN BREED
WHERE category = 'cat'
GROUP BY breed_name, medical_conditions
ORDER BY COUNT(medical_conditions) DESC;
` 

module.exports = {
    AllPets,
    findBreed,
    InsertPet,
    InsertHas,
    updatePet,
    deletePet,
    showCountOfLostAfter2019,
    showCatCommonHealthIssue
}