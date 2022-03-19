require("./database/mongoose");

const axios = require("axios");

// load database models
const User = require("./database/models/user");
const Vote = require("./database/models/vote");
const Friend = require("./database/models/friend");
const Match = require("./database/models/match");
const Room = require("./database/models/room");
const Member = require("./database/models/member");

const express = require("express");
const _ = require("underscore");

const app = express();
const port = process.env.PORT || 8080;

const { tmdb, getMovie } = require("./utils/tmdb");
const path = require("path");
const cors = require("cors");
const buildPath = "../../react/build";

app.set("port", port);

// express will parse all incoming raw JSON data to an object
app.use(express.json());
app.use(express.static(path.join(__dirname, buildPath)));

app.use(cors());

////////////////// POST //////////////////

// adds multiple members to the room, should be an array of user ids
app.post("/room/add", (req, res) => {
    console.log(req.body);

    return res.send(req.body.users);
});

//
app.post("/matches", (req, res) => {
    const users = [req.body.user1, req.body.user2];
    const userA = req.body.user1;
    const userB = req.body.user2;
    const queryParameters = {
        $or: [
            { $and: [{ user1Id: userA }, { user2Id: userB }] },
            { $and: [{ user1Id: userB }, { user2Id: userA }] },
        ],
    };

    Match.find(queryParameters).then((queryResult) => {
        res.status(200).send(queryResult);
    });
});

// creates a new room
app.post("/room", (req, res) => {
    const roomName = req.body.roomName;
    const owner = req.body.owner;

    if (roomName === undefined || owner === undefined) {
        return res.status(400).send();
    }

    const newRoom = new Room({
        roomName,
        owner,
        genres: req.body.genres,
        ratings: req.body.ratings,
        minYear: req.body.minYear,
        maxYear: req.body.maxYear,
    });

    newRoom
        .save()
        .then((savedRoom) => {
            return res.status(201).send(savedRoom);
        })
        .catch((e) => {
            return res.status(400).send(e);
        });
});

app.post("/member", (req, res) => {
    const memberData = req.body;

    if (memberData.userId === undefined || memberData.roomId === undefined) {
        return res.status(400).send();
    }

    const newMember = new Member(memberData);

    newMember
        .save()
        .then((savedMember) => {
            return res.status(201).send(savedMember);
        })
        .catch((e) => {
            return res.status(400).send(e);
        });
});

app.post("/members", (req, res) => {
    const { users, roomId } = req.body;

    if (users === undefined || roomId === undefined) {
        return res.status(400).send();
    }

    let newMembers = [];

    for (let i = 0; i < users.length; i++) {
        const userData = {
            userId: users[i].userId,
            roomId,
            status: "accepted",
            chosenMovie: null,
        };

        const newMember = new Member(userData);

        const added = addNewMember(newMember);

        if (added !== []) {
            newMembers.push(added);
        }
    }

    return res.status(201).send(newMembers);
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

// checks for and possible creates matches, this should be called after every vote is made
// will need to add a voteId to the req body
app.post("/matches/vote", (req, res) => {
    const voteID = req.body.voteId;

    if (voteID === undefined || voteID === null) {
        return res.status(400).send({});
    }

    checkForMatchesWithVote(voteID).then((result) => {
        if (result.length > 0) {
            res.status(201).send(result);
        } else {
            res.status(200).send(result);
        }
    });

    // if there are any new matches return a 201 (created) otherwise a 200 (ok)
});

// has two passed params, user1, user2, will compare all of
// user1's votes against user2's to see if there are any matches
app.post("/matches/check", (req, res) => {
    const userId = req.body.userId;

    if (userId === undefined) {
        return res.status(400).send({});
    }

    //get complete list of votes by the user and put into an array

    Vote.find({ user: userId }).then((votes) => {
        let counter = 0;
        let size = votes.length;

        for (let vote of votes) {
            const voteId = vote._id.toString();

            checkForMatchesWithVote(voteId)
                .then(() => {
                    counter++;

                    if (counter === size) {
                        res.status(200).send({});
                    }
                })
                .catch(() => {
                    res.status(400).send({});
                });
        }
    });

    // call checkForMatchesWithVote on each vote

    // res.status(200).send({});
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

    const parameters = {
        movieID,
        user,
        liked,
    };

    Vote.find(parameters).then((result) => {
        // means a vote and save if one does not exist yet
        if (result.length === 0) {
            // make a new vote object
            console.log("new vote");
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
        } else {
            // handle existing votes.
            res.status(200).send();
            console.log("existing vote...");
        }
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

// endpoint to get movie data from the tmdb site.
app.get("/movie", (req, res) => {
    const id = req.query.id;

    //if no id added with the get request, exit
    if (id === undefined) {
        return res.status(400).send();
    }

    getMovie(id, (error, response) => {
        if (error) {
            return res.status(400).send();
        }

        res.status(200).send(response);
    });
});

// gets all rooms that a user is a member of
app.get("/roomsList", (req, res) => {
    // app.get("/rooms", (req, res) => {
    const userId = req.query.userId;

    //if no id added with the get request, exit
    if (userId === undefined) {
        return res.status(400).send([]);
    }

    getUserRooms(userId)
        .then((rooms) => {
            return res.status(200).send(rooms);
        })
        .catch((e) => {
            return res.status(500).send([]);
        });
});

// get all the members of a specific room
app.get("/members", (req, res) => {
    const roomId = req.query.roomId;

    //if no id added with the get request, exit
    if (roomId === undefined) {
        return res.status(400).send([]);
    }

    getRoomMembers(roomId)
        .then((members) => {
            return res.status(200).send(members);
        })
        .catch((e) => {
            return res.status(500).send([]);
        });
});

// get an array of friends of a user
// that are not members of a specified room
app.get("/non-members", (req, res) => {
    const roomId = req.query.roomId;
    const userId = req.query.userId;

    if (roomId === undefined || userId === undefined) {
        return res.status(400).send([]);
    }

    getNonMembers(userId, roomId)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((e) => {
            console.log(e);
            return res.status(500).send(e);
        });
});

// gets all the common "votes" that like a movie within a room
app.get("/room-matches", (req, res) => {
    const roomId = req.query.roomId;

    if (roomId === undefined) {
        return res.status(400).send([]);
    }

    getRoomMatches(roomId)
        .then((result) => {
            return res.status(200).send(result);
        })
        .catch((e) => {
            return res.status(500).send(e);
        });

    // get all the
});

app.get("/room-matches-providers", (req, res) => {
    const roomId = req.query.roomId;

    if (roomId === undefined) {
        return res.status(400).send([]);
    }

    combineMovieStreams(roomId).then((results) => {
        res.send(results);
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

//remove member from room
app.delete("/member", (req, res) => {
    const { userId, roomId } = req.body;

    if (userId === undefined || roomId === undefined) {
        return res.status(400).send();
    }

    const query = {
        userId,
        roomId,
    };

    Member.deleteOne(query)
        .then((result) => {
            res.status(200).send(result);

            //todo!
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            // do a query for members with the room id to see if there are any members left,
            // if no members then delete the room
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////
            //todo!
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

// delete all matches between two users
app.delete("/matches", (req, res) => {
    const { user1, user2 } = req.body;

    if (user1 === undefined || user2 === undefined) {
        return res.status(400).send();
    }

    const query = {
        $or: [
            {
                $and: [
                    {
                        user1Id: user1,
                        user2Id: user2,
                    },
                ],
            },
            {
                $and: [
                    {
                        user1Id: user2,
                        user2Id: user1,
                    },
                ],
            },
        ],
    };

    Match.deleteMany(query)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((e) => {
            console.log("error in match deletion, endpoint: delete/matches");
            console.log(e);
            res.status(500).send();
        });
});

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

//helper functions

// gets all the members of a specified room
const getRoomMembers = async (roomId) => {
    if (roomId === undefined) {
        return [];
    }

    const memberQuery = {
        roomId,
    };

    const roomMembers = await Member.find(memberQuery);

    // get the userIds
    let userIds = [];
    for (let member of roomMembers) {
        userIds.push(member.userId);
    }

    // get the complete user details
    const usersQuery = {
        _id: { $in: userIds },
    };

    const users = await User.find(usersQuery);
    let usersNoPsw = [];

    // remove the password field
    for (let user of users) {
        usersNoPsw.push({
            userId: user._id.toString(),
            name: user.name,
            username: user.username,
        });
    }

    return usersNoPsw;
};

// gets all the rooms a user is a member of
const getUserRooms = async (user) => {
    if (user === undefined) {
        return [];
    }

    const memberQuery = {
        userId: user,
    };
    const memberships = await Member.find(memberQuery);

    // just get the roomIds
    let roomIds = [];
    for (let membership of memberships) {
        // console.log(membership.roomId);
        roomIds.push(membership.roomId);
    }

    // do another query on the room collection,
    // getting the rooms the user is a member of
    const roomQuery = {
        _id: { $in: roomIds },
    };

    const rooms = await Room.find(roomQuery);

    return rooms;
};

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

const getNonMembers = async (userId, roomId) => {
    // first get the list of friends of userID

    // console.log(userId, roomId);
    const friends = await getFriends(userId);

    // get the current member list of the room
    let memberList = [];
    const members = await getRoomMembers(roomId);
    for (let member of members) {
        memberList.push(member.userId);
    }

    // get a list of Ids that are not already members
    let nonMemberIds = [];

    for (let friend of friends) {
        if (!memberList.includes(friend.userId)) {
            nonMemberIds.push(friend.userId);
        }
    }

    const userQuery = { _id: { $in: nonMemberIds } };

    const nonMembers = await User.find(userQuery);

    let nonMembersNoPsw = [];

    for (let nonMember of nonMembers) {
        const userId = nonMember._id.toString();
        const { name, username } = nonMember;
        const entry = { userId, name, username };

        nonMembersNoPsw.push(entry);
    }

    return nonMembersNoPsw;
};

// get a list of all users on the database excluding an inputted userid
const getListExcludeUser = async (userId) => {
    const userList = await User.find({ _id: { $ne: userId } }).exec();

    return userList;
};

// get an array of objects containing the rooms the user is a member of
const getRooms = async (userId) => {};

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

    // perform query on Vote collection for records that have the same movie id and
    // whos user id is in the userFriends array, save these records in possibleMatches
    // const possibleMatches
    //      if possible vote is in alreadyMatched, skip
    //      else create a new match document.
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
            $or: [
                {
                    user1Id: user1._id.toString(),
                    user1Vote: user1Vote,
                    user2Id: user2._id.toString(),
                    user2Vote: match._id.toString(),
                    movieID: movie,
                },
                {
                    user2Id: user1._id.toString(),
                    user2Vote: user1Vote,
                    user1Id: user2._id.toString(),
                    user1Vote: match._id.toString(),
                    movieID: movie,
                },
            ],
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

const addNewMember = async (memberData) => {
    const newMember = new Member(memberData);

    await newMember
        .save()
        .then((newMember) => {
            return newMember;
        })
        .catch((e) => {
            return [];
        });
};

// will only return an array of numbers
const getLikesMoviesOnly = async (userId) => {
    const query = {
        user: userId,
        liked: true,
    };

    const ignoreFields = ["-_id", "-user", "-liked", "-__v"];

    const likedMovies = await Vote.find(query).select(ignoreFields).lean();

    const idOnly = likedMovies.map((movie) => movie.movieID);

    return idOnly;
};

// first get all the members of the room
const getRoomMatches = async (roomId) => {
    const members = await getRoomMembers(roomId);

    let memberLikes = [];

    for (let member of members) {
        memberLikes.push(await getLikesMoviesOnly(member.userId));
    }

    // get the intersection
    const intersection = _.intersection.apply(_, memberLikes);

    return intersection;
};

const getStreamProviders = async (movieId) => {
    if (movieId === undefined) {
        return [];
    }

    const getReq = await axios
        .get(
            // "https://api.themoviedb.org/3/movie/563/watch/providers?api_key=c2e4c84ff690ddf904bc717e174d2c61"
            `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=c2e4c84ff690ddf904bc717e174d2c61`
        )
        .then((res) => {
            const streamingProviders = res.data.results.CA.flatrate;

            if (streamingProviders === undefined) {
                return [];
            } else {
                return streamingProviders;
            }
        })
        .catch((e) => {
            return [e];
        });
    return getReq;
};

const combineMovieStreams = async (roomId) => {
    if (roomId === undefined) {
        return [];
    }

    const movieMatches = await getRoomMatches(roomId);

    let combined = [];

    for (let movie of movieMatches) {
        let streams = await getStreamProviders(movie);

        const movieIdAndStream = {
            movieId: movie,
            stream: streams,
        };
        console.log(movieIdAndStream);
        combined.push(movieIdAndStream);
    }

    return combined;
};

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});
