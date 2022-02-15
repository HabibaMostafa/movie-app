import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
    BrowserRouter as Router,
    HashRouter,
    Route,
    Routes,
} from "react-router-dom";

import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import useToken from "./components/App/useToken";
import Movie from "./components/Movie/Movie";
import Movies from './pages/Movies/Movies';
import Friends from './pages/Friends/Friends';
import Matches from './pages/Matches/Matches';
import Navbar from './components/Navbar/Navbar';

/* Main app */
function App() {
    const { token, setToken, removeToken } = useToken();

    /* If the user has not signed in yet, show login page*/
    if (!token) {
        return <Login setToken={setToken} />;
    }

    return (
        <>
            {/* logout button */}
            <div className="wrapper">
                <form>
                    <button className="authentication-btn" onClick={removeToken}> Logout</button>
                </form>
                <Router>
                    <Navbar/>
                        <Routes>
                            <Route exact path="/" component={Home} />
                            <Route path="/Movies" component={Movies} />
                            <Route path="/Friends" component={Friends} />
                            <Route path="/Matches" component={Matches} />
                        </Routes>
                </Router>
            </div>
            {/* Movie demo section */}
            <Movie />
        </>
    );
}

export default App;
