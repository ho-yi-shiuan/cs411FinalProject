const express = require("express");
const { getFormData } = require("../model/uploadPet");
const uploadPetController = express.Router();

//get all filter needed for upload page
uploadPetController.get("/", async (req, res) => {
    const FormData = await getFormData();
    res.status(200).json(FormData);
});

module.exports = uploadPetController;