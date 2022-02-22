require("./database/mongoose");

// load database models
const User = require("./database/models/user");
const Vote = require("./database/models/vote");
const Friend = require("./database/models/friend");

const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

const tmdb = require("./utils/tmdb");
const path = require("path");
const cors = require("cors");
const buildPath = "../../react/build";

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

            const returnToken = {
                name: user[0].name,
                username: user[0].username,
                password: user[0].password,
                _id: user[0]._id,
                state: "loggedIn",
            };

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
            res.status(201).send(newUser);
        })
        .catch((e) => {
            res.status(401).send();
        });
});

// makes a new document in the friend table
app.post("/friend", (req, res) => {
    const { user1, user2, status } = req.body;
    console.log(user1, user2, status);

    if (user1.length < 1 || user2.length < 1 || status.length < 1) {
        return res.status(400).send();
    }

    // create a new friends record and fill it with the
    // data contained in the post request
    const newFriend = new Friend({
        user1,
        user2,
        status,
    });

    // try to save the new friend document in the database
    newFriend
        .save()
        .then((newFriend) => {
            // if it was successful, send back a 201
            res.status(201).send(newFriend);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

// get the friend requests that i sent
app.post("/friend/from-me", (req, res) => {
    const { user } = req.body;

    if (user === undefined || user.length < 1) {
        return res.status(400).send();
    }

    // perform a query on the Friend collection where user1 equals
    // the user1 that was contained in the post request data
    getRequestsFromUser(user).then((result) => {
        res.status(200).send(result);
    });
});

// get my pending friend requests
app.post("/friend/to-me", (req, res) => {
    const { user } = req.body;

    if (user === undefined || user.length < 1) {
        return res.status(400).send();
    }
    getRequestsToUser(user).then((result) => {
        res.status(200).send(result);
    });
});

////////////////// GET //////////////////
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

app.get("/users", (req, res) => {
    User.find({})
        .then((users) => {
            // copy the object but ignore password and __v

            let usersNoPsw = [];

            users.forEach((user) => {
                const { _id, name, username } = user;
                const record = { _id, name, username };
                usersNoPsw.push(record);
            });

            res.send(usersNoPsw);
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

//helper functions

// RIP had to make this one async, used in POST /friend/from-me
const getRequestsFromUser = async (user) => {
    let requestsFromMe = [];

    const requestsUserMade = await Friend.find({
        user1: user,
        status: "pending",
    }).exec();

    // now make a consolidated list using the req id, user2(request accepter
    for (let request of requestsUserMade) {
        const requestId = request._id.toString();
        const userId = request.user2;
        await mergeFromUserInfoRequests(requestId, userId).then(
            (consolidated) => {
                requestsFromMe.push(consolidated);
            }
        );
    }

    return requestsFromMe;
};

// returns a objects where the friend request ID and user info (-minus password) are combined
const getRequestsToUser = async (user) => {
    let requestsToUser = [];

    const requestsUserMade = await Friend.find({
        user2: user,
        status: "pending",
    }).exec();

    // now make a consolidated list using the req id, user2(request accepter
    for (let request of requestsUserMade) {
        const requestId = request._id.toString();
        const userId = request.user1;
        await mergeFromUserInfoRequests(requestId, userId).then(
            (consolidated) => {
                requestsToUser.push(consolidated);
            }
        );
    }

    return requestsToUser;
};

const mergeFromUserInfoRequests = async (requestId, userId) => {
    // combine the requestid and user id into a new object
    // also ignore the __v and password.
    const userRecord = await User.findById(userId).exec();

    const consolidated = {
        requestId,
        userId,
        name: userRecord.name,
        username: userRecord.username,
    };

    return consolidated;
};

// .then((data) => {

//     data.forEach((friendReq) => {
//         const { _id, user2 } = friendReq;

//         // rebug

//         // do a User query for the other user
//         await User.findById(user2).then((result) => {
//             console.log(result);

//             const { name = "not found", username = "not found" } =
//                 result;
//             const consolidated = {
//                 requestId: _id,
//                 userId: result._id,
//                 user: user2,
//                 name,
//                 username,
//             };

//             // // add the consolidated record to the obj array
//             requestsFromMe.push(consolidated);
//             // console.log(consolidated);
//         });
//     });
//     console.log(requestsFromMe);
// })
// .catch((e) => {
//     res.status(400).send(e);
// });
app.get("*", (req, res) => {
    res.send("404, RIP");
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});
