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
                    <button onClick={removeToken}> Logout</button>
                </form>

                <Router>
                    <Routes>
                        <Route exact path="/" component={Home} />
                    </Routes>
                </Router>
            </div>
            {/* Movie demo section */}
            <Movie />
        </>
    );
}

export default App;
