import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Home, Friends, Movies, Matches } from "./pages/index";

import reportWebVitals from "./reportWebVitals";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/" element={<App />} /> */}
            <Route path="/friend" element={<Friends />} />
            <Route path="/movie" element={<Movies />} />
            <Route path="/match" element={<Matches />} />
        </Routes>
    </Router>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
