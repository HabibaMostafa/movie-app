import Navbar from "../../components/Navbar/Navbar";
//import MoviePage from "../../components/Movie/Movie";
import Movie from "../../components/Movie/Movie";
import useToken from "../../components/App/useToken";
import "./Movies.css";
import React from 'react';

const Movies = () => {
  const { getTokenObj } = useToken();
  const tokenObj = getTokenObj();
  const userID = tokenObj._id;
  const userName = tokenObj.username;

  return (
    <div className="container">
      <Navbar />
      <div className="movie-wrapper"> 

        <Movie _id ={userID} username={userName} />

      </div>
    </div>
  )
}
export default Movies;