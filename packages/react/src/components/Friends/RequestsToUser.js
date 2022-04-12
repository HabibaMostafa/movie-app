import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
// import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";
import loading from "../../images/loading.svg";
import "./RequestsToUser.css";

class RequestsToUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = { reqToUser: [], fetchedData: false };
        this.userToAdd = null;
    }

    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        axios
            .post("/friend/to-me", params)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ reqToUser: res.data });
                } else {
                    this.setState({ reqToUser: [] });
                }
            })
            .then(() => this.setState({ fetchedData: true }));
    }

    acceptButtonHandler = (data) => {
        // data.preventDefault()

        const requestId = {
            _id: data.requestId,
        };
        // console.log(requestId);

        axios
            .patch("/friend", requestId)
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
            <div className="requestsToUserContainer">
                <h3>Friend Requests</h3>

                {this.state.fetchedData ? (
                    <div>
                        {this.state.reqToUser.length > 0 ? (
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
                                        {this.state.reqToUser.map((value) => (
                                            <ListItem
                                                style={{
                                                    outlineColor: "black",
                                                    outlineWidth: 10
                                                }}
                                                key={value}
                                                disableGutters
                                                secondaryAction={
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.acceptButtonHandler(
                                                                value
                                                            );
                                                        }}
                                                    >
                                                        ✓
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

export default RequestsToUser;
