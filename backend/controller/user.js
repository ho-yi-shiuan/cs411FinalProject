const express = require("express");
const {getUserProfile, signup, signin} = require("../model/user");
const userController = express.Router();

userController.post("/", async (req, res) => {
  const token = req.body.token;
  const result = await getUserProfile(token);
  res.status(result.code || 200).json(result.data);
});

//user signup
userController.post("/signup", async (req, res) => {
  const user = req.body;
  const result = await signup(user);
  res.status(result.code || 200).json(result.data);
});

//user signin
userController.post("/signin", async (req, res) => {
    const user = req.body;
    let result = await signin(user);
    // if(result.data.user){
    //   res.cookie("user",result.data.user.access_token, { 
    //     secure: true,
    //     httpOnly: true
    //     //domain: 'example.com',
    //   });
    // }
    res.status(result.code || 200).json(result.data);
});



module.exports = userController;