import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import AddFriend from "../../components/Friends/AddFriend";

const Friends = () => {
    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    const testNames = ["fred", "george", "ron", "percy"];

    return (
        <div className="friendsContainer">
            <Navbar />
            <h1>Friends</h1>
            <AddFriend _id={userID} />
        </div>
    );
};
export default Friends;
