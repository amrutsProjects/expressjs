const express = require("express");
const app = express();
const path = require('path');
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");
const PORT = 3000;

const requestLogger = (req, res, next) =>{
     const method = req.method;
     const url = req.url;
     const timestamp = new Date();
     console.log(`\nrequest logged =>   Method: ${method} | URL: ${url} | Timestamp: ${timestamp}`);
     next();
};


app.use(requestLogger);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/taskwiz", taskRoutes);

app.get("/", (req, res) =>{
    htmlResponse =`
    <!DOCTYPE html>
    <html>
        <head>
            <title> Welcome page</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1>Welcome stranger!<h1>
        </body>
    </html>
    `

    res.status(200).send(htmlResponse);
});

app.get("/about", (req, res) =>{
    res.status(200).send("About Express.js");
});

app.get("/search", (req, res) =>{
    const term = req.query.term;
    if(!term){
        res.status(401).send("please include term!");
    }
    res.send(`search term: ${term}`);
});

app.get("/broken", (req, res) =>{
    throw new Error("something went wrong");
});

app.post("/echo", (req, res) =>{
    const info = req.body;
    console.log(JSON.stringify(info, null, 2));
    res.status(200).json(info);
});

app.use((req, res, next) =>{
    res.status(404).send("404: the page does not exist");
});

app.use((err, req, res, next) =>{
    res.status(500).json({
        "error": "internal server error", 
        "messege": err.messege
    });
});

app.listen(PORT, () =>{
    console.log(`app is listening at port: ${PORT}`);
});