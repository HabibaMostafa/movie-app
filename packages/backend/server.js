const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const {tmdb} = require("./utils/tmdb");

//3000 port for local, heroku's port depeneds on the server environment variable
const port = process.env.PORT || 8080;
// app.listen(port, () => {
//     console.log(`Server running on port${port}`);
// });

const buildPath = "../react/build";

app.use(express.static(path.join(__dirname, buildPath)));

app.set("port", port);

app.use(cors());

app.get("/", (req, res) => {
    // res.send("hi");
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

app.use("/login", (req, res) => {
    /* TODO: authenticate in database, create unique token */

    res.send({
        token: "test123",
    });
});

app.use("/signUp", (req, res) => {
    /* TODO: create in database, create unique token */

    res.send({
        token: "test123",
    });
});

// sample api get request
app.use("/movies", (req, res) => {


    // make request to api
    const test = tmdb({},(error, response)=>{

        if(error) {
            console.log("Error! =(")
            return;
        }

        res.send(response);
    });




});


app.get("*", (req, res) => {
    res.send("404, RIP");
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
