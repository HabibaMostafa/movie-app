import Navbar from "../../components/Navbar/Navbar";
import MoviePage from "../../components/Movie/Movie";
import useToken from "../../components/App/useToken";
import "./Movies.css";
import React from 'react';

const Movies = () => {
  const { getTokenObj } = useToken();
  const tokenObj = getTokenObj();
  const userID = tokenObj._id;

  return (
    <div className="container">
      <Navbar />
      <div className="movie-wrapper"> 
        <MoviePage _id ={userID} />
      </div>
    </div>
  )
}
export default Movies;