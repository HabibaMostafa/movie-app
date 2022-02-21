import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import FriendsList from "../../components/Friends/FriendsList";

const Friends = () => {
    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    const testNames = ["fred", "george", "ron", "percy"];

    return (
        <div className="friendsContainer">
            <Navbar />
            <h1>Friends</h1>
            <FriendsList _id={userID} />
        </div>
    );
};
export default Friends;
