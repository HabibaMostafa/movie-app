import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "./FriendsList.css";

class FriendsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.userToAdd = null;
    }

    componentDidMount() {
        // get the entire userlist which the current user can filter
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
                // console.log(this.state.allUsers);
            });
        });
    }

    // note idk why but you gotta use this way, not just the normal function =??
    friendRequestHandler = () => {

        if(this.userToAdd === null || this.userToAdd === undefined ) {
            return;
        }
        console.log("The user:", this.userToAdd);
    };

    setUserToAdd = (user) => {
        this.userToAdd = user;
    }

    render() {
        return (
            <div className="friendsListContainer">
                <p>FriendsList here</p>
                <p>current userid is {this.props._id}</p>

                <p>Add User:</p>
                <button
                    id="friend-request-btn"
                    onClick={this.friendRequestHandler}
                >
                    Send Friend Request
                </button>
                <div ref={this.userListRef}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-users"
                        options={this.state.allUsers}
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

export default FriendsList;
