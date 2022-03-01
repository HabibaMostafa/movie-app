// import React, { useState } from "react";
// import {Link} from "react-router-dom"
// import logo from "./logo.svg";
// import "./App.css";
// import {
//     BrowserRouter as Router,
//     HashRouter,
//     Route,
//     Routes,
// } from "react-router-dom";

// import Home from "./components/Home/Home";
// import Login from "./components/Login/Login";
// import useToken from "./components/App/useToken";
// import Movie from "./components/Movie/Movie";
// import Movies from "./pages/Movies/Movies";
// import Friends from "./pages/Friends/Friends";
// import Matches from "./pages/Matches/Matches";
// import Navbar from "./components/Navbar/Navbar";

// /* Main app */
// function App() {
//     const { token, setToken, removeToken, getToken } = useToken();

//     /* If the user has not signed in yet, show login page*/
//     // if (!token) {
//     if (token === null) {
//         return <Login setToken={setToken} />;
//     }

//     return (
//         <>
//             {/* logout button */}
//             <div className="wrapper">
//                 <form>
//                     <button
//                         className="authentication-btn"
//                         onClick={removeToken}
//                     >
//                         {" "}
//                         Logout
//                     </button>
//                 </form>
//                 <Router>
//                     <Navbar />
//                     <Routes>
//                         <Route exact path="/" component={Home} />
//                         <Route path="/movies" component={Movies} />
//                         <Route path="/friends" component={Friends} />
//                         <Route path="/matches" component={Matches} />
//                     </Routes>
//                 </Router>
//             </div>
//             {/* Movie demo section */}
//             <Movie />
//         </>
//     );
// }

// export default App;
