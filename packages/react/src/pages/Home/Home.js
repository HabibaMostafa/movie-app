import React, { useState } from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../../components/Home/Home";
import axios from "axios";
import "./Home.css";

function Home() {
    const { token, setToken, getTokenObj } = useToken();
    const [ numFriendRequests, setNumFriendRequests ] = useState(undefined);

    // if theres no token render the login+signup component
    if (token === null) {
        return <Login setToken={setToken} />;
    }

    const tokenObj = getTokenObj();
    const params = {
        user: tokenObj._id,
    };
    
    axios.post("/friend/to-me", params).then((res) => {
        if (res.status === 200) {
           setNumFriendRequests(res.data.length);
        } else {
            setNumFriendRequests(0);
        }
    });

    return (
        <div className="home">
            <Navbar />
            <div className="home-wrapper">
                <p className="welcome-msg">Welcome, {tokenObj.username}! </p>
                <a style={{ textDecoration: "none" }} href="/friends">You have {numFriendRequests} pending friend request(s).</a>
                <p><br></br>Check out some of the latest movies:</p>
                <HomePage _id ={tokenObj._id} />
            </div>
        </div>
    );    
}

function getNumFriendRequests(tokenObj){
   
}

export default Home;