import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
// import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";

import "./RequestsToUser.css";

class RequestsToUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = { reqToUser: [] };
        this.userToAdd = null;
    }

    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        axios.post("/friend/to-me", params).then((res) => {
            if (res.status === 200) {
                this.setState({ reqToUser: res.data });
            } else {
                this.setState({ reqToUser: [] });
            }
        });
    }

    acceptButtonHandler = (data) => {
        // data.preventDefault()

        const requestId = {
            _id: data.requestId,
        };
        // console.log(requestId);

        axios
            .patch("/friend", requestId )
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
                <h3>Friend Requests To User</h3>
                <div>
                    <Paper
                        style={{
                            maxHeight: 200,
                            overflow: "auto",
                            maxWidth: 300,
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
                                    key={value}
                                    disableGutters
                                    secondaryAction={
                                        <IconButton
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.acceptButtonHandler(value);
                                            }}
                                        >
                                            accept
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={value.username} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }
}

export default RequestsToUser;
