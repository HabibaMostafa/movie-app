import React from "react";
import axios from "axios";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
// import CommentIcon from "@mui/icons-material/Comment";
import IconButton from "@mui/material/IconButton";



import "./RequestsFromUser.css";

class RequestsFromUser extends React.Component {
    constructor(props) {
        super(props);

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

    render() {
        return (
            <div className="requestsFromUserContainer">
                <h3>Friend Requests From User</h3>
                <div>
                    <Paper style={{ maxHeight: 200, overflow: "auto", maxWidth: 300 }}>
                        <List
                            sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                            }}
                        >
                            {this.state.userFriends.map((value) => (
                                <ListItem
                                    key={value}
                                    disableGutters
                                    secondaryAction={<IconButton>X</IconButton>}
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

export default RequestsFromUser;
