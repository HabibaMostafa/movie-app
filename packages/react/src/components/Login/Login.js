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
import { ThemeProvider } from "@mui/material/styles";
import theme from './../../theme';
import "./Login.css";
import Button from '@mui/material/Button';
import { Fragment } from "react/cjs/react.production.min";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

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
            <ThemeProvider theme={theme}>
            <Fragment>
                <div className="login-wrapper">
                    <br></br><br></br><br></br>
                    <img src={logo} />
                    <div className="login-form">
                    <h1>Login</h1>
                        <form onSubmit={handleLogin}>
                            <label>
                                <p>  </p>
                                <TextField id="filled-basic" label="Username" variant="filled"
                                    required
                                    style={{
                                        backgroundColor: "white",
                                        width: "355px"
                                    }}
                                    className="login-input"
                                    type="text"
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </label>
                            <label>
                                <p>  </p>
                                <TextField id="filled-basic" label="Password" variant="filled" 
                                    required
                                    style={{
                                        backgroundColor: "white",
                                        width: "355px"
                                    }}
                                    className="login-input"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <div className="centered">
                                <Button size = "large" variant="contained"
                                    id = "buttons"
                                    className="authentication-btn"
                                    type="submit"
                                >
                                    LOG IN     
                                </Button>
                                &nbsp;&nbsp;
                                <Button size = "large" variant="contained" 
                                    id = "buttons"
                                    className="signup-btn"
                                    onClick={() => setState("signUp")}
                                >
                                    SIGN UP
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
            </ThemeProvider>
        );
    }

    // Show create user page
    if (state === "signUp") {
        return (
            <ThemeProvider theme={theme}>
            <Fragment>
                <div className="login-wrapper">
                    <br></br><br></br><br></br>
                    <img src={logo} />
                    <div className="login-form">
                    <h1>Sign Up</h1>
                    <form onSubmit={handlesignUp}>
                        <label>
                            <p> </p>
                            <TextField id="filled-basic" label="Name" variant="filled"
                                required
                                style={{
                                    backgroundColor: "white",
                                    width: "435px"
                                }}
                                className="login-input"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            <p> </p>
                            <TextField id="filled-basic" label="Username" variant="filled"
                                required
                                style={{
                                    backgroundColor: "white",
                                    width: "435px",
                                }}
                                className="login-input"
                                type="text"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </label>
                        <label>
                            <p>  </p>
                            <TextField id="filled-basic" label="Password" variant="filled"
                                required
                                style={{
                                    backgroundColor: "white",
                                    width: "435px",
                                }}
                                className="login-input"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <div className="centered">
                        <Button size = "large" variant="contained"
                                id = "buttons"
                                className="authentication-btn"
                                type="submit"
                            >
                                CREATE ACCOUNT
                            </Button>
                            &nbsp;&nbsp;
                            <Button size = "large" variant="contained" 
                                id = "buttons"
                                className="signup-btn"
                                onClick={() => setState("login")}
                            >
                                BACK
                            </Button>
                        </div>
                    </form>
                    </div>
                </div>
            </Fragment>
            </ThemeProvider>
        );
    }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
};
