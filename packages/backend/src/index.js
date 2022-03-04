require("./database/mongoose");

// load database models
const User = require("./database/models/user");
const Vote = require("./database/models/vote");
const Friend = require("./database/models/friend");
const Match = require("./database/models/match");

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

//
app.post("/matches", (req, res) => {
    const user1 = req.body.user1;
    const user2 = req.body.user2;
    res.send(user1 + user2);
});

// checks for and possible creates matches, this should be called after every vote is made
// will need to add a voteId to the req body
app.post("/matches/vote", (req, res) => {
    // ObjectId("622171a72484af5ac33637d2") debug

    const voteID = req.body.voteId;
    // debug

    console.log("ayy the vote id was: " + req.body.voteId);

    // const voteID = "622171a72484af5ac33637d2";

    if (voteID === undefined || voteID === null) {
        return res.status(400).send();
    }

    const test = checkForMatchesWithVote(voteID);
    res.send(test);
});

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
    const movieID = req.body.id;
    const user = req.body.user;
    const liked = true;

    // make a new vote object
    const newVote = new Vote({
        movieID,
        user,
        liked,
    });

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

    if (user1.length < 1 || user2.length < 1 || status.length < 1) {
        return res.status(400).send();
    }

    //specific check to accept an existing request
    acceptPendingReq(user1, user2).then((acceptedRequest) => {
        if (acceptedRequest === true) {
            return res.status(200).send("Accepted pending request");
        } else {
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
        }
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

// gett all of a user's votes
app.get("/votes", (req, res) => {
    let userId = req.query.user;

    Vote.find({ user: userId }).then((result) => {
        res.send(result);
    });
});

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
// for accepting a friend request
app.patch("/friend", (req, res) => {
    const idToUpdate = req.body;

    if (
        idToUpdate._id == undefined ||
        idToUpdate._id == null ||
        idToUpdate._id.length < 1
    ) {
        return res.status(400).send("bad request");
    }

    Friend.findOneAndUpdate(idToUpdate, { status: "accepted" })
        .then((result) => {
            // console.log(result);
            return res.status(200).send();
            // return res.status(200).send("successfully accepted friend request");
        })
        .catch((e) => {
            // console.log(e);
            return res.status(400).send();
            // return res.status(400).send("error, could not accept friend request");
        });

    // res.send(req.body);
});

//DELETE
app.delete("/friend", (req, res) => {
    const idToDelete = req.body;

    // console.log(idToDelete);

    if (
        idToDelete._id == undefined ||
        idToDelete._id == null ||
        idToDelete._id.length < 1
    ) {
        return res.status(400).send("bad request");
    }

    Friend.findOneAndDelete(idToDelete)
        .then((result) => {
            // console.log(result);
            return res.status(200).send();
            // return res.status(200).send("successfully deleted friend document");
        })
        .catch((e) => {
            // console.log(e);
            return res.status(400).send();
            // return res.status(400).send("error, could not delete requested document");
        });
});

//TMDB endpoints

// sample api get request
app.post("/movies", (req, res) => {
    // make request to api
    var pageNum = req.body.pageNum;
    const test = tmdb({ pageNum }, (error, response) => {
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

// called by /friend, will accept a freidn request if it already exists.
// Returns True if a pending request existed and was accepted
const acceptPendingReq = async (currentUser, otherUser) => {
    let acceptedRequest = false;

    await Friend.findOneAndUpdate(
        {
            user1: otherUser,
            user2: currentUser,
            status: "pending",
        },
        {
            status: "accepted",
        }
    )
        .then((result) => {
            if (result !== null) {
                acceptedRequest = true;
            } else {
                acceptedRequest = false;
            }
        })
        .catch((e) => {
            acceptedRequest = false;
        });

    return acceptedRequest;
};

// returns an object of votes where the user liked liked a movie.
const getUserLikes = async (userId) => {
    const query = {
        user: userId,
        liked: true,
    };

    const userLikes = await Vote.find(query).exec();

    return userLikes;
};

// returns an object of votes where the user disliked a movie.
const getUserDislikes = async (userId) => {
    const query = {
        user: userId,
        liked: false,
    };

    const userLikes = await Vote.find(query).exec();

    return userLikes;
};

const getVote = async (voteID) => {
    const theVote = await Vote.findById(voteID).exec();

    return theVote;
};

// checks for any new matches with a specific vote
const checkForMatchesWithVote = async (vote_id) => {
    // a list of other votes this vote has already been matched with
    let alreadyMatched = [];

    // get the vote document from the collection
    const theVote = await getVote(vote_id);

    // get the movie id from the vote, userid, and user friends list
    const movie = theVote.movieID;
    const userId = theVote.user;

    // check that the vote is actually set to true for liked, skip it if it isnt
    if (theVote.liked === false) {
        return;
    }

    // get the friends list for this
    const userFriendsObjs = await getFriends(userId);
    let userFriends = [];

    for (let friend of userFriendsObjs) {
        userFriends.push(friend.userId);
    }

    // console.log(userFriends);

    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    // see if there are any match documents in the Matches collection that have this vote id,  ///////////////////
    // if there are any, add the other vote in that match document to the vote ignore list.    ///////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////
    /////////////////////////////////////////////////////////////////TODO/////////////////////////////////////////

    // perform query on Vote collection for records that have the same movie id and
    // whos user id is in the userFriends array, save these records in possibleMatches
    // const possibleMatches

    //if possible vote is in alreadyMatched, skip

    //else create a new match document.
    // if a new one is made add it to newMatches

    const newMatches = await matchVotes(userFriends, theVote);

    return newMatches;
};

const matchVotes = async (friendList, theVote) => {
    const movie = theVote.movieID;
    const userId = theVote.user;
    const user1Vote = theVote._id.toString();

    const user1 = await User.findById(userId);
    const user1Username = user1.username;

    const friendsOnly = { user: { $in: friendList } };
    const voteNotByUser = { user: { $ne: userId } };
    const specificMovie = { movieID: movie };

    // const possibleMatches = await Vote.find({user: {$in: friendList}}).exec();

    const possibleMatches = await Vote.find({
        $and: [friendsOnly, voteNotByUser, specificMovie],
    }).exec();

    let newMatches = [];

    // create a match object for every possible match
    for (let match of possibleMatches) {
        //
        const user2 = await User.findById(match.user);
        const user2Username = user2.username;

        // check if a record already exist.

        const searchParameters = {
            user1Id: user1._id.toString(),
            user1Vote: user1Vote,
            user2Id: user2._id.toString(),
            user2Vote: match._id.toString(),
            movieID: movie,
        };
        const existingDocument = await Match.find(searchParameters);

        //if there no existing match document, make it and save
        if (existingDocument.length === 0) {
            const newMatch = new Match({
                user1Id: user1._id.toString(),
                user1Vote: user1Vote,
                user1Username: user1Username,
                user2Id: user2._id.toString(),
                user2Vote: match._id.toString(),
                user2Username: user2Username,
                movieID: movie,
            });

            await newMatch.save().then((result) => {
                newMatches.push(result);
            });
        }
    }

    return newMatches;
};

// does a full check of the database
const checkForMatchesWithUser = async (user) => {};

const createNewMatch = async (vote1, vote2, movie) => {};

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});
