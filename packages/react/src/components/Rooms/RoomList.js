import React from "react";
import axios from "axios";
import "./Room.css";

import Room from "./Room";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";

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
                    <Grid
                        container
                        spacing={0}
                        rowSpacing={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        style={{ 
                            minHeight: 100,
                            maxHeight: 500 }}
                    >
                        <Grid item xs={8}>
                            <div className="content-wrapper">
                                <h3>Select a Room</h3>
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            <div className="content-wrapper">
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
                            </div>
                        </Grid>
                        <Grid item xs={8}>
                            <div className="content-wrapper">
                                <Room
                                    room={this.state.selectedRoom}
                                    userId={this.props._id}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </div>
            );
        }

        // return this if user is not a member of any rooms
        else {
            return <div className="room-wrapper">You are not currently a member of any rooms.</div>;
        }
    }
}

export default RoomList;
