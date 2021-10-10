const config = require("./config");
const express = require('express');
const app = express();
const port = config.web.port;
const cors = require('cors');
const server = require('http').Server(app);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {
  userController,
  petController,
  uploadPetController
} = require("./controller");

app.use(cors({
  origin: [
    "http://localhost:8080"
  ],
  methods: [
    'GET', 'PUT', 'POST', 'DELETE'
  ],
  credentials: true,
}));

app.use("/user", userController);
app.use("/upload", uploadPetController);
app.use("/pet", petController);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to brownie's website" });
  });

server.listen(3000, function(){
    console.log(`connected to port ${port}`);
});