import Navbar from "../../components/Navbar/Navbar";
import Movie from "../../components/Movie/Movie";
import useToken from "../../components/App/useToken";

import React from 'react'
const Movies = () => {
  return (
    <div className="container">
      <Navbar />
      <h1>Movies</h1>
      <Movie />
      
    </div>
  )
}
export default Movies;