import Navbar from "../../components/Navbar/Navbar";

import useToken from "../../components/App/useToken";
import RoomDrawer from "../../components/Rooms/RoomDrawer";
import React from "react";

const Rooms = () => {
    const { getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
        <div className="container">
            <Navbar />
            <h1>Rooms!</h1>
            <p>{userID}</p>
            <RoomDrawer />
        </div>
    );
};
export default Rooms;
