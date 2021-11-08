const express = require("express");
const { getFormData } = require("../model/uploadPet");
const uploadPetController = express.Router();

//get all filter needed for upload page
uploadPetController.get("/", async (req, res) => {
    const result = await getFormData();
    res.status(result.code || 200).json(result.data);
});

module.exports = uploadPetController;