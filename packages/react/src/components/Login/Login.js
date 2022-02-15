/* Code used from tutorial: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications */

import React, { useState } from "react";
import PropTypes from "prop-types";
import logo from "../../logo-white.png";

import "./Login.css";

async function loginUser(credentials) {
    return fetch("/login", {
        // return fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

export default function Login({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
            username,
            password,
        });
        setToken(token);
    };

    return (
        <div className="login-wrapper">
            <img src={logo}/>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input className="login-input"
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input className="login-input"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <div>
                    <button className="authentication-btn" type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
