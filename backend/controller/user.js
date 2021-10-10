const express = require("express");
//const { presignAssetPost, createAsset} = require("../service/asset");
const {getUserProfile} = require("../model/user");
const userController = express.Router();

userController.get("/user", async (req, res) => {
    let userID = req.cookies.userID;
    if(token) {
      const result = await getUserProfile(userID);
      if(result.data){
        res.status(result.code || 200).json(result.data);
        return;
      
      }else{
        res.status(401).end();
        return;

      }
    }else{
      res.status(401).end();
        return;
    }
});



module.exports = userController;