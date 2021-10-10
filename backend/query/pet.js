const AllPets = `
    SELECT * FROM PET;
`;
const findBreed = `
    SELECT bid FROM BREED 
    WHERE breedName = ? AND category = ?;
`;

const InsertPet = `
    INSERT INTO PET(contact, status, date, picture, name, bid, category, age, color, size, gender, chip_status, injured_flag, zip_code, mark_solved) 
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
const InsertHas = `
    INSERT INTO Has (PetID, healthID) VALUES
`;

module.exports = {
    AllPets,
    findBreed,
    InsertPet,
    InsertHas
}