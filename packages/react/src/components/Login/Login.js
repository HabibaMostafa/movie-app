/* Code used from tutorial: https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications 

    let navigate = useNavigate();

            <div>
                <button onClick={() => {navigate("/Create");}}>New User? Create account</button>
            </div>
*/

import React, { useState } from "react";
import PropTypes from "prop-types";
import logo from "../../logo-white.png";
import { useParams, useNavigate } from "react-router-dom";

import "./Login.css";
import { Fragment } from "react/cjs/react.production.min";

async function loginUser(credentials) {
    return fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

async function signUp(credentials) {
    return fetch("/signUp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    }).then((data) => data.json());
}

export default function Login({ setToken }) {
    const [name, setName] = useState();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [state, setState] = useState();

    // Calls function to log the user in with form data
    const handleLogin = async (e) => {
        e.preventDefault();

        const userInput = {
            username,
            password,
        };

        const token = await loginUser(userInput);
        setToken(token);
    };

    // Calls function to create the user with form data
    const handlesignUp = async (e) => {
        e.preventDefault();

        const userInput = {
            name,
            username,
            password,
        };

        const token = await signUp(userInput);
        setToken(token);
    };

    // Show login page on default
    if (state === undefined) {
        setState("login");
    }

    // Show login page
    if (state === "login") {
        return (
            <Fragment>
                <div className="login-wrapper">
                    <img src={logo} />
                    <h1>Log In</h1>
                    <form onSubmit={handleLogin}>
                        <label>
                            <p>Username</p>
                            <input
                                className="login-input"
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </label>
                        <label>
                            <p>Password</p>
                            <input
                                className="login-input"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <div>
                            <button
                                className="authentication-btn"
                                type="submit"
                            >
                                Submit
                            </button>
                            <button
                                className="authentication-btn"
                                onClick={() => setState("signUp")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </Fragment>
        );
    }

    // Show create user page
    if (state === "signUp") {
        return (
            <Fragment>
                <div className="login-wrapper">
                    <img src={logo} />
                    <h1>Sign Up</h1>
                    <form onSubmit={handlesignUp}>
                        <label>
                            <p>Name</p>
                            <input
                                className="login-input"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            <p>Username</p>
                            <input
                                className="login-input"
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </label>
                        <label>
                            <p>Password</p>
                            <input
                                className="login-input"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <div>
                            <button
                                className="authentication-btn"
                                type="submit"
                            >
                                Submit
                            </button>
                            <button
                                className="authentication-btn"
                                onClick={() => setState("login")}
                            >
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </Fragment>
        );
    }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
