import React, { useState } from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../../components/Home/Home";
import axios from "axios";
import "./Home.css";
import Typography from '@mui/material/Typography';


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
                        <Typography sx={{ fontSize: 40 }} color="white" gutterBottom>
                        Welcome, {tokenObj.username}
                        </Typography>
                        <Typography variant="h5" component="div">
                        </Typography>
                        <Typography sx={{ mb: 1.5, fontSize: 20 }} color="text.secondary">
                        <a className="title" style={{ textDecoration: "none"}} href="/friends">You have {numFriendRequests} pending friend request(s).</a>
                        </Typography>
                        <Typography variant="body2">
                        <br />
                        </Typography>
                        <Typography sx={{ fontSize: 25 }} color="white" gutterBottom>
                        Check out some of the latest movies
                        </Typography>
                <HomePage _id ={tokenObj._id} />
            </div>
        </div>
    );    
}

function getNumFriendRequests(tokenObj){
   
}

export default Home;