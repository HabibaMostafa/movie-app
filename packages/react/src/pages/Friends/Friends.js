import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import AddFriend from "../../components/Friends/AddFriend";
import FriendsList from "../../components/Friends/FriendsList";
import RequestsFromUser from "../../components/Friends/RequestsFromUser";
import RequestsToUser from "../../components/Friends/RequestsToUser";

const Friends = () => {
    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
        <div className="friendsContainer">
            <Navbar />
            <div className="wrapper">
                <h1>Friends</h1>
                <AddFriend _id={userID} />
                <FriendsList _id={userID} />
                <RequestsFromUser _id={userID} />
                <RequestsToUser _id={userID} />
            </div>
        </div>
    );
};
export default Friends;
