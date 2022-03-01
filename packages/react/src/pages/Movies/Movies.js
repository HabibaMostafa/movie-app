import Navbar from "../../components/Navbar/Navbar";
import Movie from "../../components/Movie/Movie";
import useToken from "../../components/App/useToken";

import React from 'react'

const Movies = () => {
  const { getTokenObj } = useToken();
  const tokenObj = getTokenObj();
  const userID = tokenObj._id;

  return (
    <div className="container">
      <Navbar />
      <h1>Movies</h1>
      <Movie _id ={userID} />
      
    </div>
  )
}
export default Movies;