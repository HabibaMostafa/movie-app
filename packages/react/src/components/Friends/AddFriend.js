import React from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./AddFriend.css";
import { Grid } from "@mui/material";
import { Paper } from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import loading from "../../images/loading.svg";

class AddFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notFriends: [], dataFetched: false, expand: false };
        this.userToAdd = null;
    }

    componentDidMount() {
        // get the entire userlist which the current user can filter

        // create a different end point that will get a list of users this current user is not friends with (excluding own id)
        fetch("/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        }).then((res) => {
            //// callback(data.json());
            res.json().then((data) => {
                this.setState({ allUsers: data });
            });
        });

        const params = {
            user: this.props._id,
        };

        axios
            .post("/friend/not-friends", params)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ notFriends: res.data });
                } else {
                    this.setState({ notFriends: [] });
                }
            })
            .then(() => this.setState({ dataFetched: true }));
    }

    expandHandler = () => {
        this.setState({ expand: !this.state.expand });
    };

    // note idk why but you gotta use this way, not just the normal function =??
    friendRequestHandler = () => {
        if (this.userToAdd === null || this.userToAdd === undefined) {
            return;
        }

        // do a post request here for the server to create a friend request
        const friendRequestData = {
            user1: this.props._id,
            user2: this.userToAdd._id,
            status: "pending",
        };
        axios.post("/friend", friendRequestData).then((res) => {
            // check res.status, 201 good, else you fucked it up
            if (res.status !== 201 && res.status !== 200) {
                // return an indication it didnt work, popup or something
                // like an android toast
                console.log(
                    "Failed: unable to send friend request.",
                    res.status,
                    res
                );
            }

            // indication it was successful somehow,
            else {
                console.log("Friend request sent");
            }
        });

        // refresh the window for now
        // better if there was a way to reload everything...
        window.location.reload(true);
    };

    setUserToAdd = (user) => {
        this.userToAdd = user;
    };

    populateUserList = async () => {
        // create a different end point that will get a list of users this current user is not friends with (excluding own id)
        await fetch("/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        }).then((res) => {
            //// callback(data.json());
            res.json().then((data) => {
                this.setState({ allUsers: data });
            });
        });

        const params = {
            user: this.props._id,
        };

        await axios.post("/friend/not-friends", params).then((res) => {
            //"not-friends" ='(

            // console.log(res.data);
            if (res.status === 200) {
                this.setState({ notFriends: res.data });
            } else {
                this.setState({ notFriends: [] });
            }
        });
    };

    render() {
        return (
            <div className="addFriendContainer">
                <div className="invite-friend-header">
                    <div className="invite-friend-header">
                        <h3 className="invite-friend-header">
                            Invite a Friend
                        </h3>
                    </div>
                    <div className="expand-btn" onClick={this.expandHandler}>
                        {this.state.expand ? (
                            <ExpandLessIcon
                                fontSize="large"
                                sx={{ fill: "goldenrod" }}
                            />
                        ) : (
                            <ExpandMoreIcon
                                fontSize="large"
                                sx={{ fill: "goldenrod" }}
                            />
                        )}
                    </div>
                </div>

                {this.state.expand ? (
                    <div>
                        {this.state.dataFetched ? (
                            <div>
                                <div ref={this.userListRef}>
                                    <Autocomplete
                                        size="small"
                                        disablePortal
                                        id="combo-box-users"
                                        options={this.state.notFriends} // set this to notFriends array
                                        getOptionLabel={(option) =>
                                            option.username
                                        }
                                        sx={{ width: 360 }}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                        onChange={(e, selectedUser) => {
                                            this.setUserToAdd(selectedUser);
                                        }}
                                        PaperComponent={({ children }) => (
                                            <Paper
                                                style={{ background: "yellow" }}
                                            >
                                                {children}
                                            </Paper>
                                        )}
                                    />
                                </div>
                                <div className="centered">
                                    <Button
                                        variant="contained"
                                        id="friend-request-btn"
                                        onClick={this.friendRequestHandler}
                                    >
                                        Send Friend Request
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <img src={loading} alt="loading animation">
                                    {" "}
                                </img>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="hidden"></div>
                )}
            </div>
        );
    }
}

export default AddFriend;
