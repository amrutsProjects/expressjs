const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt")
require("dotenv").config()
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) =>{
    res.send("welcome to homepage");
});

app.listen(port, () =>{
    console.log("server is running at port ", port)
});