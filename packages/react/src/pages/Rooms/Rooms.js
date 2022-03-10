import Navbar from "../../components/Navbar/Navbar";

import useToken from "../../components/App/useToken";

import RoomList from "../../components/Rooms/RoomList";
import CreateRoom from "../../components/Rooms/CreateRoom";

import React from "react";
import "./Rooms.css";

const Rooms = () => {
    const { getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
        <div class="container">
            <Navbar />
            {/* <h1>Rooms!</h1>
            <p>{userID}</p> */}
            <CreateRoom _id={userID} />
            <RoomList _id={userID} />

            {/* show incoming room requests */}

            {/* show room requests you made*/}
        </div>
    );
};
export default Rooms;
