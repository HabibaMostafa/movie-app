import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, HashRouter, Route, Routes } from 'react-router-dom';

import Home from './components/Home/Home';
import Login from './components/Login/Login';

/* Sets the token used for authentication */
function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

/* Gets the token used for authentication */
function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

/* Main app */
function App() {
  const token = getToken();

  /* If the user has not signed in yet, show login page*/
  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
        <Router>
          <Routes>
            <Route exact path="/" component={Home} />

          </Routes>
        </Router>
    </div>
  );
}

export default App;
