import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
    Home,
    Friends,
    Movies,
    Matches,
    Rooms,
    UserPage,
    Settings,
} from "./pages/index";

import reportWebVitals from "./reportWebVitals";
// test

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useHistory,
    useParams,
} from "react-router-dom";

ReactDOM.render(
    <Router>
        <Routes>
            {/* <Route path="UserPage"> */}
            <Route path="/UserPage/:LMAO" element={<UserPage />} />
            {/* <UserPage /> */}
            {/* </Route> */}

            {/* <Route path="/UserPage*" element={<UserPage />} /> */}

            <Route path="/" element={<Home />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/friends/*" element={<Friends />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/*" element={<Movies />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/*" element={<Matches />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/*" element={<Rooms />} />

            <Route path="/settings*" element={<Settings />} />

            {/* <Route path="*"/> */}
            <Route path="*" element={<Home />} />
        </Routes>
    </Router>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
