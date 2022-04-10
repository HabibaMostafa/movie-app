import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
// import CommentIcon from "@mui/icons-material/Comment";

//navigate is passed in props ....

import "./FriendsList.css";

class FriendsList extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        this.state = { userFriends: [] };
        this.userToAdd = null;
    }

    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        axios.post("/friend/user-friends", params).then((res) => {
            if (res.status === 200) {
                this.setState({ userFriends: res.data });
            } else {
                this.setState({ userFriends: [] });
            }
        });
    }

    getFriendArray = () => {
        return this.state.userFriends;
    };

    deleteMatches = async (user1, user2) => {
        if (user1 === undefined || user2 === undefined) {
            console.log(user1, user2);
            return;
        }

        const params = {
            user1,
            user2,
        };

        await axios
            .delete("/matches", { data: params })
            .then((response) => {
                console.log(response);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    deleteButtonHandler = async (data) => {
        // data.preventDefault()

        const requestId = {
            _id: data.requestId,
        };
        // console.log(requestId);

        await axios
            .delete("/friend", { data: requestId })
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    // refresh the window for now

                    //deletes matches between the two users
                    this.deleteMatches(data.userId, this.props._id)
                        .then(() => {
                            window.location.reload(true);
                        })
                        .catch(() => {
                            window.location.reload(true);
                        });

                    // better if there was a way to reload everything...
                    // window.location.reload(true);
                } else {
                    //have a notification there was an error
                }
            })
            .catch((e) => {
                //hav a notification there was an error
                console.log(e);
            });
    };

    render() {
        return (
            <div className="friendsListContainer">
                <h3>Friends List</h3>
                <div>
                    <Paper
                        style={{
                            maxHeight: 500,
                            overflow: "auto",
                            maxWidth: 360,
                            padding: "10px",
                        }}
                    >
                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "#FFFFFF",
                            }}
                        >
                            {this.state.userFriends.map((value) => (
                                <ListItem
                                    key={value}
                                    disableGutters
                                    secondaryAction={
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.deleteButtonHandler(value);
                                            }}
                                        >
                                            [X]
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            value.username +
                                            " (" +
                                            value.name +
                                            ")"
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.props.navigate(
                                                `/UserPage/${value.userId}`
                                            );
                                            window.location.reload(true);
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default FriendsList;
