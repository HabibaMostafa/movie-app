import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import "./Matches.css";


import MatchList from "../../components/Matches/MatchList";

const Matches = () => {

    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
      
        <div className="matches-wrapper">
            <Navbar />
            <MatchList _id={userID} />
        </div>
    );
};
export default Matches;
