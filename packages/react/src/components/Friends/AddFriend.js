import React from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import "./AddFriend.css";

class AddFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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

        axios.post("/friend/not-friends", params).then((res) => {

            // console.log(res.data); 
            if (res.status === 200) {
                this.setState({ notFriends: res.data });
            }
            else {
                
                this.setState({ notFriends: [] });
            }

        });
    }

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
            if (res.status !== 201) {
                // return an indication it didnt work, popup or something
                // like an android toast
                console.log("Failed: unable to send friend request.");
            }

            // indication it was successful somehow,
            console.log("Friend request sent");
        });
    };

    setUserToAdd = (user) => {
        this.userToAdd = user;
    };

    render() {
        return (
            <div className="addFriendContainer">
                <h3>Add User:</h3>
                <Button variant="contained"
                    id="friend-request-btn"
                    onClick={this.friendRequestHandler}
                >
                    Send Friend Request
                </Button>
                <div ref={this.userListRef}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-users"
                        options={this.state.notFriends} // set this to notFriends array
                        getOptionLabel={(option) => option.username}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e, selectedUser) => {
                            this.setUserToAdd(selectedUser);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default AddFriend;
