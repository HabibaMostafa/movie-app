import React from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";

function Home() {
    const { token, setToken, getTokenObj } = useToken();

    // if theres no token render the login+signup component
    if (token === null) {
        return <Login setToken={setToken} />;
    }


    const tokenObj = getTokenObj();

    return (
        <div className="home">
            <Navbar />
            <h1>Home</h1>
            <p>Welcome User: {tokenObj.username}</p>
        </div>

    );
}

export default Home;
