const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to brownie's website" });
  });

server.listen(3000, function(){
    console.log("connected to port 3000");
});

module.exports = app;