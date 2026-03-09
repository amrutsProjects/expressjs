const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const PORT = process.env.PORT || 3000;

const app = express();

const users = [{
    id: 1,
    name: "amrut",
    password: "123"
},
{
    id: 2,
    name: "pooja",
    password: "1234"
}];

const sessions = {};
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

const authenticate = (req, res, next) =>{
    const sessionId = req.cookies.sessionId;
    if(!sessionId || !sessions[sessionId]){
        return res.status(401).send("Invalid credentials");
    }
    req.user = users.find(u => u.id === sessions[sessionId].id);
    next();
}; 

app.get("/", (req, res) =>{
    const sessionId = req.cookies.sessionId;
    if(!sessionId || !sessions[sessionId]){
        return res.send(`
            <form action="/login", method="POST">
                <label for = "name"> Name: <label>
                <input type = "text" name = "name" id = "name">
                <label for = "password"> Password: <label>
                <input type="password" name = "password" id = "password">
                <button type="submit">Login</button>
            <form>
            `);
    };
    const userid = sessions[sessionId].id
    const user = users.find(u => u.id === userid);
    res.send(`Welcome Back, ${user.name || "user"}`);
});

app.get("/dashboard", authenticate, (req, res) =>{
    res.send(`welcome to dashboard, ${req.user.name}`);
});

app.post("/login", (req, res) =>{
    const formdata = req.body;
    console.log(formdata);
    if(!formdata){
        return res.status(401).send("please add credentials first");
    }

    const user = users.find(u => u.name === formdata.name && u.password === formdata.password);
    if (user){
        const sessionId = crypto.randomBytes(16).toString("hex");
        sessions[sessionId] = {
            id: user.id,
            startTime: Date.now()
        }

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            maxAge: 60000
        });

        console.log(`${formdata.name} has logged in`);
        res.redirect("/")
    }
});

app.get("/logout", (req, res) =>{
    const sessionId = req.cookies.sessionId;
    if(sessionId){
        delete sessions[sessionId];
    }
    res.clearCookie("sessionId");
    res.send("logged out successfully")
});

app.listen(PORT, () =>{
    console.log("server is running at port", PORT);
});