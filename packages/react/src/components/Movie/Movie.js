import React from "react";
import axios from "axios";
import "./Movie.css";

var movie;
var min;
var max;
var page = 1;
const movieIndex = [];
var index = 0;

class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const params = {
            pageNum: page,
        };

        axios.post("/movies", params).then((res) => {

            // console.log(res.data); 
            if (res.status === 200) {
                index = 0;
                this.setState({ movies: res.data });
                //create a list of movies to display in carousel
                this.setMovieIndex();
                //set the next movie to display
                this.setMovie();
            }
            else {
                this.setState({ movies: [] });
            }
        });
    }

    //create a list of movies to display in carousel
    setMovieIndex() {
        min = Math.ceil(0);
        max = Math.floor(this.state.movies.body.results.length - 1);
        
        //create an array of unique randomly generated numbers. each number represents a movie in the movies list.
        while(movieIndex.length < max){
          var candidateInt = Math.floor(Math.random() * (max - min + 1)) + min;
          if(movieIndex.indexOf(candidateInt) === -1) movieIndex.push(candidateInt);
        }
        return movieIndex;
    }

    //set a movie to display based on what the next number in the movieIndex is. 
    setMovie() {
        //const coverSize = 300;

        //as long as there are still movies not displayed in the list then set them to the states. 
        //...and iterate the list. 
        if (index<max) {
            movie = this.state.movies.body.results[movieIndex[index]];
            index++;

            //// probably a better way to restructure this?
            this.setState({ title: movie.title });
            this.setState({
                poster_path:
                "https://image.tmdb.org/t/p/w300" + movie.poster_path,
            });
            this.setState({ overview: movie.overview });
            //// this.setState({ title : mov.title });
            
            console.log(this.state.title);
            console.log(movie);
        } else {
            //show an alert or update list and data with new movies. 
            console.log("refreshing movie list");
            page++;
            this.componentDidMount()
            //TODO: add more movies to the list when out of movies. 
        }
    }

    //method for when the user "likes" the movie on display
    likeMovie() {
        //TODO: add (movie) to the database as a "liked" movie.
        console.log("like pressed");
    }

    //method for when the user "dislikes" the movie on display
    dislikeMovie() {
        //TODO: add (movie) to the database as a "liked" movie.
        console.log("dislike pressed");
    }

    render() {
        return (
            <section className="movie">
                <div className="content">
                    <div className="movie-grid">
                        <div className="movie-display">
                            <div className="movie-visual">
                                <h3 className="movie-title">{this.state.title}</h3>
                                <img src={this.state.poster_path} alt="Movie Poster"></img>
                            </div>
                            <div className="like-dislike-btns">
                                <button 
                                id="like-btn" 
                                className="movie-btn" 
                                onClick={() => {
                                    this.likeMovie();
                                    this.setMovie();
                                }}>Like</button>
                                <button 
                                id="dislike-btn" 
                                className="movie-btn" 
                                onClick={() => {
                                    this.dislikeMovie();
                                    this.setMovie();
                                }}>Dislike</button>
                            </div>
                        </div>
                        <div className="movie-info">
                            <h3>Description</h3>
                            <p>{this.state.overview}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Movie;
