import Navbar from "../../components/Navbar/Navbar";
import UserSettings from "../../components/Settings/UserSettings";
import useToken from "../../components/App/useToken";
import { useParams } from "react-router-dom";
import "./Settings.css";

import React from "react";
import { useDropzone } from "react-dropzone";

const Settings = () => {
    const { getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    return (
        <div className="container">
            <Navbar />
            <div className="settings-wrapper">
                <UserSettings userId={userID} useDropzone={useDropzone} />
            </div>
        </div>
    );
};
export default Settings;
