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
        <div className="rooms-container">
            <Navbar />
            <CreateRoom _id={userID} />
            <RoomList _id={userID} />
        </div>
    );
};
export default Rooms;
