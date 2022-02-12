const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

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

app.use("/createUser", (req, res) => {
    /* TODO: create in database, create unique token */

    res.send({
        token: "test123",
    });
});

app.get("*", (req, res) => {
    res.send("404, RIP");
});

app.listen(port, () => console.log(`API is running on port${port}`));
