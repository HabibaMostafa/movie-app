import Navbar from "../../components/Navbar/Navbar";

import { useParams } from "react-router-dom";

import React from "react";

import UserPageData from "../../components/UserPage/UserPageData";
import useToken from "../../components/App/useToken";

const UserPage = () => {
    const { id } = useParams();

    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const username = tokenObj.username


    

    return (
        <div className="container">
            <Navbar />

            <div className="userpage-wrapper">
                <UserPageData accessorId={id} userId={id} username={username} />
            </div>
            
        </div>
    );
};
export default UserPage;
