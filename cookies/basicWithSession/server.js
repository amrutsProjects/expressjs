const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const users = [
    {
        id: 1,
        username: "amrut",
        password: "123"
    },
    {
        id: 2,
        username: "pooja",
        password: "1234"
    }
];

const sessions = {};

const checkSession = (req, res, next) => {
    const sessionId = req.cookies.sessionId;
    if(!sessionId){
        return res.redirect("/login");
    }
    res.locals.username = sessions[sessionId].username;
    next();
};

app.get("/", checkSession, (req, res) =>{
    res.send(`Welcome to server ${res.locals.username}`);
});

app.get("/login", (req, res) =>{
    res.send(`
            <form action = "/createSession" method = "POST">
                <label for = "username">USERNAME: </label>
                <input type = "text" id = "username" name = "username">
                <br>
                <label for = "password">PASSWORD: </label>
                <input type = "password" id = "password" name = "password">
                <br>
                <button type = "submit">Log In</button>
            </form>
        `)
});

app.post("/createSession", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.username === username);
    if(!user){
        console.log("incorrect username!!");
        return res.redirect("/login");
    }
    if(user.password !== password){
        console.log("incorrect password!!");
        return res.redirect("login");
    }
     const sessionId = crypto.randomBytes(16).toString("hex");
     console.log("session created for username: ", user.username);

     sessions[sessionId] = {
        id : user.id,
        username: user.username
     };
     res.cookie("sessionId", sessionId, {
        maxAge : 60 * 1000,
        httpOnly: true
     });
     res.redirect("/");
});

app.listen(PORT, () =>{
    console.log("server is running at port", PORT);
});