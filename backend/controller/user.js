const express = require("express");
const {getUserProfile, signup, signin} = require("../model/user");
const userController = express.Router();

userController.post("/", async (req, res) => {
  //const token = req.cookies.user;
  const token = "54dec20e2b0a245534678f32fbce679f3cce85de0352cb322e8c95f7bedf16c4";
  const result = await getUserProfile(token);
  res.status(200).json(result.data);
});

//user signup
userController.post("/signup", async (req, res) => {
  const user = req.body;
  const result = await signup(user);
  res.cookie("user",data.user.access_token, { 
    secure: true,
    httpOnly: true
    //domain: 'example.com',
  });
  res.status(200).json(result.data);
});

//user signin
userController.post("/signin", async (req, res) => {
  const user = req.body;
  const result = await signin(user);
  res.cookie("user",result.data.user.access_token, { 
    secure: true,
    httpOnly: true
    //domain: 'example.com',
  });
  res.status(200).json(result.data);
});



module.exports = userController;