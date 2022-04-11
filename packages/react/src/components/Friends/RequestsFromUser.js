import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
// import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import loading from "../../images/loading.svg";

import "./RequestsFromUser.css";

class RequestsFromUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = { reqFromMe: [], fetchedRequests: false };
        this.userToAdd = null;
    }

    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        axios
            .post("/friend/from-me", params)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ reqFromMe: res.data });
                } else {
                    this.setState({ reqFromMe: [] });
                }
            })
            .then(() => this.setState({ fetchedRequests: true }));
    }

    deleteButtonHandler = (data) => {
        // data.preventDefault()

        const requestId = {
            _id: data.requestId,
        };
        // console.log(requestId);

        axios
            .delete("/friend", { data: requestId })
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    // refresh the window for now
                    // better if there was a way to reload everything...
                    window.location.reload(true);
                } else {
                    //have a notification there was an error
                }
            })
            .catch((e) => {
                //hav a notification there was an error
                // console.log(e);
            });
    };

    render() {
        return (
            <div className="requestsFromUserContainer">
                <h3>Friend Requests From Me</h3>

                {this.state.fetchedRequests ? (
                    <div>
                        {this.state.reqFromMe.length > 0 ? (
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
                                            bgcolor: "background.paper",
                                        }}
                                    >
                                        {this.state.reqFromMe.map((value) => (
                                            <ListItem
                                                key={value}
                                                disableGutters
                                                sx={{
                                                    padding: "10px",
                                                }}
                                                secondaryAction={
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.deleteButtonHandler(
                                                                value
                                                            );
                                                        }}
                                                        aria-label="delete"
                                                    >
                                                        x
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText
                                                    primary={value.username}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </div>
                        ) : (
                            <div>No pending requests</div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h3>Checking Requests</h3>
                        <img src={loading} alt="loading animation"></img>
                    </div>
                )}
            </div>
        );
    }
}

export default RequestsFromUser;
