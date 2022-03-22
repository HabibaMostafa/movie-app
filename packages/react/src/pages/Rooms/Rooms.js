import Navbar from "../../components/Navbar/Navbar";

import useToken from "../../components/App/useToken";

import RoomList from "../../components/Rooms/RoomList";
import CreateRoom from "../../components/Rooms/CreateRoom";

import React from "react";
import "./Rooms.css";

import Grid from "@mui/material/Grid";

const Rooms = () => {
    const { getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
        <div>
            <Navbar />
            <div className="rooms-container">
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
                    <CreateRoom _id={userID} />
                </Grid>
                <Grid item xs={8}>
                    <RoomList _id={userID} />
                </Grid>
            </Grid>
            </div>
        </div>
        
    );
};
export default Rooms;
