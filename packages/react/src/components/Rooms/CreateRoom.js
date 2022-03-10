// import React from "react";
import axios from "axios";
// import "./Drawer.css";
// import Button from '@mui/material/Button';

// class CreateRoom extends React.Component {
//     constructor(props) {
//         if (props === {}) {
//             return;
//         }

//         super(props);
//         this.props = props;
//     }

//     componentDidMount() {}
//     render() {
//         return (
//             <div class="createroom-container">

//                 {/* create new room? */}
//                 <Button>New Room</Button>

//             </div>
//         );
//     }
// }

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// const [open, setOpen] = React.useState(false);

// function CreateRoom() {
class CreateRoom extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;

        this.state = { open: false, roomName: "", userId: "" };
    }

    componentDidMount() {
        this.setState({ open: false });
        this.setState({ userId: this.props._id });
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    createNewRoom = async () => {
        // console.log(this.state.roomName);
        // console.log(this.props._id);

        // post to /room to make a new room
        const params = {
            roomName: this.state.roomName,
            owner: this.props._id,
        };

        // this will create a new room
        await axios.post("/room", params).then((res) => {
            // console.log(res.data._id);

            // only make a member addition to the new room if it is
            if (res.status === 201) {
                // a new room was successful created

                const newMember = {
                    userId: this.props._id,
                    roomId: res.data._id,
                    roomName: res.data.roomName,
                    status: "accepted",
                    chosenMovie: "",
                };

                axios.post("/member", newMember).then((res) => {
                    if (res.status === 201) {
                        // a user was successfully added as a member
                    }
                });

                // this will add the current user as a member of the room they created.
            }
        });

        // finally close the dialog.
        return this.setState({ open: false });
    };

    handleNameChange = (e) => {
        this.setState({ roomName: e.target.value });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    render() {
        return (
            <div>
                <Button variant="outlined" onClick={this.handleClickOpen}>
                    Create New Room
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Create New Room</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>New Room Name</DialogContentText> */}
                        <TextField
                            autoFocus
                            margin="dense"
                            id="newRoomName"
                            label="Room Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={this.handleNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        <Button onClick={this.createNewRoom}>Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default CreateRoom;
