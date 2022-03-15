import React from "react";
import axios from "axios";
import "./Room.css";

import Room from "./Room";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

class RoomList extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;

        this.state = { userId: "", userRooms: [], selectedRoom: {} };
    }

    componentDidMount() {
        // axios.get(`/rooms?userId=${this.props._id}`).then((res) => {
        axios.get(`/roomsList?userId=${this.props._id}`).then((res) => {
            if (res.status === 200) {
                this.setState({ userRooms: res.data });
            }
        });
    }

    setRoom = (room) => {
        this.setState({ selectedRoom: room });
    };
    render() {
        if (this.state.userRooms.length > 0) {
            return (
                <div className="room-wrapper">
                    <Autocomplete
                        disablePortal
                        id="combo-box-rooms"
                        options={this.state.userRooms} // set this to notFriends array
                        getOptionLabel={(option) => option.roomName}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e, selectedRoom) => {
                            this.setRoom(selectedRoom);
                        }}
                    />
                    <Room
                        room={this.state.selectedRoom}
                        userId={this.props._id}
                    />
                </div>
            );
        }

        // return this if user is not a member of any rooms
        else {
            return <div className="room-wrapper"></div>;
        }
    }
}

export default RoomList;
