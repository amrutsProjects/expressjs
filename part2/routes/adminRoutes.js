const express = require("express");
const routes = express.Router();

const checkApiKey = (req, res, next) =>{
    const apiKey = req.query.api_key;
    try{
        if (!apiKey || apiKey !== "secret123"){
            return res.status(401).send("Access Denied")
        }
        console.log("admin identified!")
        next();
    }
    catch(error){
        console.log(`internal error occured: ${error}`);
    }  
};

routes.get("/", checkApiKey, (req, res) =>{
    res.send("welcome to admin dashboard!");
});

module.exports = routes;