import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import Home from "../Home/Home";

const Friends = () => {
    const { token, setToken, getTokenObj } = useToken();

    if (token === null) {
        return <Home />;
    }

    return (
        <div className="friendsContainer">
            <Navbar />
            <h1>Friends</h1>
        </div>
    );
};
export default Friends;
