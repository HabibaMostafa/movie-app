import React from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../../components/Home/Home";
import "./Home.css";

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
            <div className="home-wrapper">
                <p className="welcome-msg">Hey {tokenObj.username}! Checkout our latest movies </p>
                <HomePage _id ={tokenObj._id} />
            </div>
        </div>
    );
}

export default Home;


// const Card = () => {
//     return (
//       <div className="card">
//         <img src="123.png" alt="profile" className="image" />
//       </div>
//     );
//   };
  

//   <Card />
//   <Card />
//   <Card />
//   <Card />
//   <Card />
//   <Card />
//   <Card />
//   <Card />
//   <Card />

/*
import React from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import HomePage from "../../components/Home/Home";

//const { token, setToken, getTokenObj } = useToken();
const Home = () => {
  const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    // if theres no token render the login+signup component
    if (token === null) {
        return <Login setToken={setToken} />;
    }

    return (
        <div className="home">
            <Navbar />
            <div className="home-wrapper">
                <p className="welcome-msg">Hey {tokenObj.username}! Checkout our latest movies </p>
                <HomePage _id ={userID} />
            </div>
        </div>
    );
}

export default Home;

*/