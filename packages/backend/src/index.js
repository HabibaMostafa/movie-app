require("./database/mongoose");

// load database models
const User = require("./database/models/user");
const Vote = require("./database/models/vote");

const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

const tmdb = require("./utils/tmdb");
const path = require("path");
const cors = require("cors");
const buildPath = "../react/build";

app.set("port", port);

// express will parse all incoming raw JSON data to an object
app.use(express.json());
app.use(express.static(path.join(__dirname, buildPath)));

app.use(cors());


////////////////// POST //////////////////

//create a new user
app.post("/users", (req, res) => {
    const newUser = new User(req.body);

    newUser
        .save()
        .then(() => {
            res.status(201).send(newUser);
        })
        .catch((e) => {
            // call .status before sending the response
            // same as doing res.status(400) then res.send(e)
            res.status(400).send(e);
        });
});

//create a new vote (user swipes)
app.post("/votes", (req, res) => {
    const newVote = new Vote(req.body);

    newVote
        .save()
        .then(() => {
            res.status(201).send(newVote);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

//login
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // check db if username and password match
    User.find({
        username: username,
        password: password,
    })
        .then((user) => {
            if (user.length != 1) {
                return res.status(401).send("error: invalid login");
            }

            // still send the same old token for now

            const returnToken = {
                name: user[0].name,
                username: user[0].username,
                password: user[0].password,
                _id: user[0]._id,
                state: "loggedIn",
            };

            // res.status(201).send(returnToken);

            res.status(200).send(returnToken);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

//signup
app.post("/signup", (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;

    // make a new user object with the request data
    const newUser = new User({
        name,
        username,
        password,
    });

    // try to save the new user
    newUser
        .save()
        .then((newUser) => {
            if (newUser.length != 1) {
                return res
                    .status(400)
                    .send("error: invalid new user credentials");
            }

            const returnToken = {
                username: newUser[0].username,
                _id: newUser[0]._id,
                state: "loggedIn",
            };

            res.status(201).send(returnToken);
        })
        .catch((e) => {
            res.status(401).send();
        });
});

////////////////// GET //////////////////
app.get("/", (req, res) => {
    // res.send("hi");
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

app.get("/users", (req, res) => {
    User.find({})
        .then((users) => {
            res.send(users);
        })
        .catch((e) => {
            res.status(500).send();
        });
});

// user route parameters ":id"
app.get("/users/:id", (req, res) => {
    const _id = req.params.id;

    User.findById(_id)
        .then((user) => {
            if (!user) {
                return res.status(404).send();
            }

            res.send(user);
        })
        .catch((e) => {
            res.status(500).send();
        });
});

//PATCH

//DELETE

//TMDB endpoints

// sample api get request
app.post("/movies", (req, res) => {
    // make request to api
    const test = tmdb({}, (error, response) => {
        if (error) {
            console.log("Error! =(");
            return;
        }

        res.send(response);
    });
});








// app.use(express.static("client/build"));

// app.get("*", (req, res) => {

// res.sendFile(path.resolve(__dirname, "client", "build", "index.html")});





app.get("*", (req, res) => {
    res.send("404, RIP");
});



app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});
