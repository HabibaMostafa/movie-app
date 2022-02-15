/* Code used from tutorial: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications */

import React, { useState } from "react";

import "./Create.css";

async function createUser(credentials) {
    return fetch("/createUser", {
        // return fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

export default function Create({ setToken }) {
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await createUser({
            username,
            password,
        });
        setToken(token);
    };

    return (
        <div className="create-wrapper">
            <h1>Please Create a New Account</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </label>
                <label>
                    <p>Password</p>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

