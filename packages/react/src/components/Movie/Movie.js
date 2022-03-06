import React from "react";
import axios from "axios";
import "./Movie.css";
import { getGenre } from "./Genre.js";

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
        this.setState({ showDescrption: true });

        axios.post("/movies", params).then((res) => {
            // console.log(res.data);
            if (res.status === 200) {
                index = 0;
                this.setState({ movies: res.data });
                //create a list of movies to display in carousel
                this.setMovieIndex();
                //set the next movie to display
                this.setMovie();
            } else {
                this.setState({ movies: [] });
            }
        });
    }

    //create a list of movies to display in carousel
    setMovieIndex() {
        min = Math.ceil(0);
        max = Math.floor(this.state.movies.body.results.length - 1);

        //create an array of unique randomly generated numbers. each number represents a movie in the movies list.
        while (movieIndex.length < max) {
            var candidateInt =
                Math.floor(Math.random() * (max - min + 1)) + min;
            if (movieIndex.indexOf(candidateInt) === -1)
                movieIndex.push(candidateInt);
        }
        return movieIndex;
    }

    //set a movie to display based on what the next number in the movieIndex is.
    setMovie() {
        //const coverSize = 300;

        //as long as there are still movies not displayed in the list then set them to the states.
        //...and iterate the list.
        if (index < max) {
            movie = this.state.movies.body.results[movieIndex[index]];
            index++;

            console.log(movie);

            //// probably a better way to restructure this?
            this.setState({ title: movie.title });
            this.setState({
                poster_path:
                    "https://image.tmdb.org/t/p/w300" + movie.poster_path,
            });
            this.setState({ overview: movie.overview });
            this.setState({ release: movie.release_date });

            //grab genre ids then convert and save genre names
            var genreIDArr = movie.genre_ids;
            var genresArr = [];
            for (let g=0; g<genreIDArr.length; g++) {
                genresArr.push(getGenre(genreIDArr[g]));
            }
            this.setState({ genres: genresArr.join(', ') });

            //// this.setState({ title : mov.title });
        } else {
            //show an alert or update list and data with new movies.
            console.log("refreshing movie list");
            page++;
            this.componentDidMount();
            //TODO: add more movies to the list when out of movies.
        }
    }

    //method for when the user "likes" the movie on display
    likeMovie = async () => {
        let userID = this.props._id;

        let data = JSON.stringify({ id: movie.id, user: userID });

        const like = await fetch("/votes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: data,
        }).then((res) => res.json());

        // now check if there are any new matches using the
        const params = {
            voteId: like._id.toString(),
        };

        axios.post("/matches/vote", params).then((response) => {
            //need new match notification here
            if (response.status === 201) {
                //means new matches were made,
                //make a notification appear or something here

                //should be in response.data
                console.log("new match!");
                console.log(response.data);
            }
        });
    };

    //method for when the user "dislikes" the movie on display
    dislikeMovie() {
        //TODO: add (movie) to the database as a "liked" movie.
        console.log("dislike pressed");
    }

    //if movie poster is clicked then change state to display or hide description
    displayData() {
        //console.log(movieInfo.style.display);
        if (this.state.showDescrption) {
            this.setState({ showDescrption: false });
        } else {
            this.setState({ showDescrption: true });
        }
    }

    //if description is hidden then chnage movie elements to block to center in screen
    // otherwise make then follow the grid display to center everything together. 
    className() {
        if (this.state.showDescrption) {
            return "movie-grid";
        } else {
            return "movie-block";
        }
    }

    render() {
        return (
            <section className="movie">
                <div className="content">
                    <div className={ this.className() }>
                        <div className="movie-display">
                            <div className="movie-visual">
                                <h3 className="movie-title">
                                    {this.state.title}
                                </h3>
                                <img
                                    className="movie-poster"
                                    onClick={() => {
                                        this.displayData();
                                    }}
                                    src={this.state.poster_path}
                                    alt="Movie Poster"
                                ></img>
                            </div>
                            <div className="like-dislike-btns">
                                <button
                                    className="movie-btn"
                                    onClick={() => {
                                        this.likeMovie();
                                        this.setMovie();
                                    }}
                                >
                                    Like
                                </button>
                                <button
                                    id="dislike-btn"
                                    className="movie-btn"
                                    onClick={() => {
                                        this.dislikeMovie();
                                        this.setMovie();
                                    }}
                                >
                                    Dislike
                                </button>
                            </div>
                        </div>
                        <div>
                            {this.state.showDescrption ?(
                                <div id='minfo' className="movie-info">
                                    <h3>Description</h3>
                                    <p>{this.state.overview}</p>
                                    <h4>Release Date</h4>
                                    <p>{this.state.release}</p>
                                    <h4>Genre(s)</h4>
                                    <p>{this.state.genres}</p>
                                </div>
                            ) : (
                                <div className="hidden"></div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default Movie;
