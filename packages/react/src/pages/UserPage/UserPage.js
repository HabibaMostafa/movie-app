import Navbar from "../../components/Navbar/Navbar";

import { useParams } from "react-router-dom";

import React from "react";

import UserPageData from "../../components/UserPage/UserPageData";

const UserPage = () => {
    const { id } = useParams();

    return (
        <div className="container">
            <Navbar />

            <div className="userpage-wrapper">
                <UserPageData userId={id} />
            </div>
        </div>
    );
};
export default UserPage;
