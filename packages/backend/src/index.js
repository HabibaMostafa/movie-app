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

//get a list of votes the user has made 
app.post("/user/movie-votes", (req, res) => {
    const { user } = req.body;

    if (user.length < 1) {
        return res.status(400).send();
    }

    // potential getVotes function
    // getVotes(user).then((result) => {
    //     res.status(200).send(result);
    // });
});

// makes a new document in the friend table
app.post("/friend", (req, res) => {
    const { user1, user2, status } = req.body;

    if (user1.length < 1 || user2.length < 1 || status.length < 1) {
        return res.status(400).send();
    }

    //////////////////////////////////////////////////////////////////////////////TODO see if theres an existing request between the two users where
    ////////////////////////////////////////////////////////////////////////////// user 2 was the requestor, instead of making a new one just set that request to be accepted

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

// gets a list of people the user is not friends with and has not requested.
app.post("/friend/not-friends", (req, res) => {
    const { user } = req.body;

    if (user.length < 1) {
        return res.status(400).send();
    }

    // get users list minus requesting user
    // check friends list to see if there are any records where user1 is the requestor,
    // if there are push user2 ids into another array
    // remove elements from the users list where the _id is equal to one of the ids in the second array
    getNonFriends(user).then((result) => {
        res.status(200).send(result);
    });
});

//get a list of users the user is friends with.
app.post("/friend/user-friends", (req, res) => {
    const { user } = req.body;

    if (user.length < 1) {
        return res.status(400).send();
    }

    getFriends(user).then((result) => {
        res.status(200).send(result);
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

// gets an array of friend request documents the user made
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

// gets an array of pending friend request documents to the user
const getRequestsToUser = async (user) => {
    let requestsToUser = [];

    const requests = await Friend.find({
        user2: user,
        status: "pending",
    }).exec();

    // now make a consolidated list using the req id, user2(request accepter
    for (let request of requests) {
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

// returns a objects where the friend request ID and user info (-minus password) are combined
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

// get a list of all users on the database excluding an inputted userid
const getListExcludeUser = async (userId) => {
    const userList = await User.find({ _id: { $ne: userId } }).exec();

    return userList;
};

const getFriends = async (userId) => {
    // list of all users minus the passed userId
    // const userList = await getListExcludeUser(userId);

    const acceptedRequests = await getAcceptedRequests(userId);

    // extract the frend's id from the requests array
    let friendsList = [];
    for (let request of acceptedRequests) {
        let toAdd = undefined;

        if (request.user1 === userId) {
            toAdd = request.user2;
            // acceptedUsers.push(request.user2);
        } else {
            toAdd = request.user1;
            // acceptedUsers.push(request.user1);
        }

        if (toAdd === undefined) {
            return;
        }

        const requestId = request._id.toString();

        await mergeFromUserInfoRequests(requestId, toAdd).then((result) => {
            friendsList.push(result);
        });
    }

    return friendsList;
};

// get a list of accepted friend documents involving the inputted user
const getAcceptedRequests = async (userID) => {
    const accepted = await Friend.find({
        $and: [
            { $or: [{ user1: userID }, { user2: userID }] },
            { status: "accepted" },
        ],
    }).exec();
    return accepted;
};

// get a list of users an inputter user is not friends with.
const getNonFriends = async (userId) => {
    // list of all users minus the passed userId
    const userList = await getListExcludeUser(userId);

    // list of pending friend requests from the passed userID
    const usersRequests = await getRequestsFromUser(userId);

    // get a list of users that are already friends
    const friends = await getFriends(userId);

    // populate the "alreadyRequested" array with userID's the
    // inputter user had already made a friend requested
    let skipUser = [];
    for (let request of usersRequests) {
        skipUser.push(request.userId);
    }

    for (let friend of friends) {
        skipUser.push(friend.userId);
    }

    let nonFriends = [];
    // compare userList to alreadyRequested list, if the id
    // is in alreadyRequested, remove from array
    for (let user of userList) {
        if (!skipUser.includes(user._id.toString())) {
            // omit the password and __v columns
            const redactedRecord = {
                _id: user._id,
                name: user.name,
                username: user.username,
            };

            nonFriends.push(redactedRecord);
        }
    }

    return nonFriends;
};

app.get("*", (req, res) => {
    res.status(404).send("404, RIP");
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});
