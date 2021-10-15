const express = require("express");
const {getPetList, InsertPet, SearchPet} = require("../model/pet");
const petController = express.Router();
const app = express();
const fs = require('fs');
const AWS = require('aws-sdk');
const config = require("../config");
AWS.config.update(config.aws);
var multer  = require('multer');
var multerS3 = require('multer-s3');
const s3 = new AWS.S3();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'browniefinal/PetImage',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now()+file.originalname);
      }
    })
  })

//get all pet list for main page
petController.get("/allPets", async (req, res) => {
    const results = await getPetList();
    res.status(200).json(results.data);
});

//upload form content for new pet
petController.post("/",upload.single('picture'), async (req, res) => {
  const pet = req.body;
  const result = await InsertPet(pet.userId, pet.status, pet.date, req.file.key, pet.name, pet.breed, pet.category, pet.age, pet.color, pet.size, pet.gender, pet.chip_status, pet.health_issue, pet.zip_code, 0);
  res.status(200).json(result.data);
});

//upload form content for new pet
petController.post("/search", async (req, res) => {
  const pet = req.body;
  console.log(pet);
  const result = await SearchPet(pet.status, pet.dateStart, pet.dateEnd, pet.breed, pet.category, pet.color, pet.size, pet.gender, pet.checkbox, pet.health_issue, pet.zipcode)
  res.status(200).json(result.data);
});

module.exports = petController;