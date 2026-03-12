const express = require("express");
const app = express();
const db = require("./db");
require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/", (req, res) =>{
    res.send("hello, from server");
});

app.get("/users", async (req, res) =>{
    try{
        const users = await db.query("SELECT * FROM users");
        res.json(users["rows"]);
    }catch(err){
        console.log(err);
        res.status(500).send("internal server error");
    }
});

app.post("/adduser", async (req, res) =>{
    try{
        const {name, email} = req.body;
    if(!name || !email){
        return res.status(400).send("request is missing name or email");
    }
    const result = await db.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *", [name, email]);
    res.json(result.rows[0]);
    }catch(err){
        if(err){
            return console.error("could not add user: ", err.stack);
        }
        res.status(500).send("internal server error");
    }
    
});

app.listen(PORT, () =>{
    console.log("server is running at port:", PORT);
});