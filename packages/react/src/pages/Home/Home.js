import React from "react";
import Login from "../../components/Login/Login";
import useToken from "../../components/App/useToken";
import Navbar from "../../components/Navbar/Navbar";
import "./Home.css";
import placeholder1 from './placeholder-1.png'; // Tell Webpack this JS file uses this image
import placeholder2 from './placeholder-2.png'; // Tell Webpack this JS file uses this image
import placeholder3 from './placeholder-3.png'; // Tell Webpack this JS file uses this image


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
                <img src={ placeholder2 } alt="profile" className="image" />
                <img src={ placeholder1 } alt="profile" className="image" />
                <img src={ placeholder3 } alt="profile" className="image" />
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