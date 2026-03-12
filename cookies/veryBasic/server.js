const express= require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) =>{
    const mode = req.cookies.theme || "light";
    res.send(`
            <h1>Hello, you are using ${mode} theme.</h1>
            <a href="/changeTheme/light"> Light </a>
            <br/>
            <a href="/changeTheme/dark"> Dark </a>
        `);
});

app.get("/changeTheme/:mode", (req, res) =>{
        const mode = req.params.mode;
        console.log("selected mode: ", mode);
        if(!(mode == "dark" || mode == "light")){
           return res.status(401).send("Please enter valid mode")
        }
        res.cookie("theme", mode, {
            maxAge: 60 * 1000,
            httpOnly: true
        });
        res.redirect("/");
});

app.get("/logout", (req, res) =>{
    res.clearCookie("theme");
    res.send("cleared cookies");
});

app.listen(PORT, () =>{
    console.log("server running at port 3000");
});
