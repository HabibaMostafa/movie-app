import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Movie.css";
import YouTube from "react-youtube";


import _ from "underscore";

import Button from "@mui/material/Button";
import { getGenre, getGenreID } from "./Genre.js";

import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import PlatformFilter from "./PlatformFilter";

//icon for the must watch button
import FavoriteIcon from "@mui/icons-material/Favorite";

var movie;
var likesList;
var min;
var max;
var page = 1;
const movieIndex = [];
var index = 0;
var trailer = null;
const genreList = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
];

class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showGenreOptions: false,
            selectedGenre: 0,
            selectedPlatforms: [],
            availablePlatforms: [],
        };
    }

    componentDidMount() {
        const params = {
            pageNum: page,
        };
        this.setState({ showDescrption: true });

        //get a list of previously "liked" movies
        this.getLikedList();

        axios.post("/movies", params).then((res) => {
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

    setSelectedGenre = (selection) => {
        if (selection === undefined || selection === null) {
            this.setState({ selectedGenre: 0 }, () => {
                return;
            });
        } else {
            let id = getGenreID(selection);
            this.setState({ selectedGenre: id }, () => {
                return;
            });
        }
    };

    filterByGenre = (show) => {
        if (show) {
            return (
                <Stack spacing={3} sx={{ width: 300 }}>
                    <Autocomplete
                        id="tags-standard"
                        options={genreList}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField {...params} variant="standard" />
                        )}
                        onChange={(e, selection) => {
                            this.setSelectedGenre(selection);
                        }}
                    />
                </Stack>
            );
        }
    };

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

    getLikedList = async () => {
        axios.get(`/votes?user=${this.props._id}`).then((result) => {
            if (result.status === 200) {
                this.setState({ likes: result.data });
            }
        });
    };

    //set a movie to display based on what the next number in the movieIndex is.
    setMovie() {
        movie = this.state.movies.body.results[movieIndex[index]];

        this.getStreamProviders(movie.id)

        // console.log(this.state);

        var filters = false;

        try {

            while (filters === false && this.state.availablePlatforms.length > 0) {
                if (
                    this.genreFilter(movie) === true &&
                    this.likeFilter(movie) === true &&
                    this.streamFilter(movie) === true
                ) {
                    filters = true;
                } else {
                    //get new movie
                    index++;
                    if (index >= max) {
                        page++;
                        this.componentDidMount();
                    }

                    movie = this.state.movies.body.results[movieIndex[index]];
                }
            }

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
            for (let g = 0; g < genreIDArr.length; g++) {
                genresArr.push(getGenre(genreIDArr[g]));
            }
            this.setState({ genres: genresArr.join(", ") });

            //setState is called in the below function for movietrailer
            this.getMovieTrailerID(movie.id);

            this.getMovieCast(movie.id);

            index++;
        } catch (error) {
            console.log("out of movies. Error: " + error);
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
                const toastData = () => (
                    <div>
                        <a href="/matches" style={{ textDecoration: "none" }}>
                            {"New match with " +
                                response.data[0].user2Username +
                                "!"}
                        </a>
                    </div>
                );
                toast.info(toastData);
            }
        });
    };

    //method for selecting a movie  as a must watch
    mustWatchMovie = async () => {
        let userID = this.props._id;

        let data = JSON.stringify({
            id: movie.id,
            user: userID,
            mustWatch: true,
        });

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
                const toastData = () => (
                    <div>
                        <a href="/matches" style={{ textDecoration: "none" }}>
                            {"New match with " +
                                response.data[0].user2Username +
                                "!"}
                        </a>
                    </div>
                );
                toast.info(toastData);
            }
        });
    };

    // HIIII ALEXXX 😆
    // should proabbly throw this into the backend instead but w/e,
    // Hello Miles! :D yeah we can move this later. if it isn't broken why fix it right?
    getMovieTrailerID = async (movieId) => {
        const apiKey = "c2e4c84ff690ddf904bc717e174d2c61";
        const tmdb_url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

        await axios.get(tmdb_url).then((res) => {
            // hmm results[0] is UK, and results[1] is US... i'm
            // just getting the first element to be safe

            const youtubeKey = res.data.results[0].key;

            this.setState({ movietrailer: youtubeKey });
        });
    };

    getMovieCast = async (movieId) => {
        const apiKey = "c2e4c84ff690ddf904bc717e174d2c61";
        const tmdb_url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;

        await axios.get(tmdb_url).then((res) => {
            const cast = res.data.cast;
            let castString = cast[0].name;

            // only show top 10 actors
            if (cast.length < 10) {
                for (let i = 1; i < cast.length; i++) {
                    castString = castString.concat(", " + cast[i].name);
                }
            } else {
                for (let i = 1; i < 10; i++) {
                    castString = castString.concat(", " + cast[i].name);
                }
            }

            this.setState({ cast: castString });
        });
    };

    streamFilter = (movie) => {
        
        const intersection = _.intersection(this.state.selectedPlatforms, this.state.availablePlatforms )
        
        
        if(intersection.length > 0 || this.state.selectedPlatforms.length === 0 ) {
            
            console.log(movie.title, "platforms: ", this.state.availablePlatforms)
            console.log("selected platforms: ", this.state.selectedPlatforms)
            console.log("intersection ", intersection)
            return true
        }

        else {
            return false
        }

    }

    getStreamProviders = async (movieId) => {
        const tmdb_url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=c2e4c84ff690ddf904bc717e174d2c61`;
        await axios.get(tmdb_url).then((res) => {
            const streamingProviders = res.data.results.CA.flatrate;
            if (
                res.data.results.CA.flatrate !== undefined &&
                res.data.results.CA.flatrate.length > 0
            ) {
                // for each provider,

                let companies = [];

                for (let company of streamingProviders) {
                    companies.push(company.provider_name);
                }


                this.setState({availablePlatforms: companies})
            } else {
                this.setState({availablePlatforms: ["None"]})
                
            }
        })
        .catch((e) => {
            this.setState({availablePlatforms: ["error"]})
            // console.log(["error"]);
        });
    };




    //if movie poster is clicked then change state to display or hide description
    displayData() {
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

    getMovieTrailer = async (id) => {
        var data = null;
        await axios.get(`/movie?id=${id}`).then((result) => {
            if (result.status === 200) {
                data = result.data.body;
            }
        });

        if (data.videos && data.videos.results) {
            trailer = data.videos.results.find(
                (vid) => vid.name === "Official Trailer"
            );
            return trailer ? trailer : data.videos.results[0];
        }
    };

    genreFilter(movie) {
        var foundGenre = false;
        var genreIDArr = movie.genre_ids;

        if (this.state.selectedGenre != 0) {
            for (let i = 0; i < genreIDArr.length; i++) {
                if (genreIDArr[i] === this.state.selectedGenre) {
                    return true;
                }
            }
        } else {
            return true;
        }

        return false;
    }

    platformFilter = async (movie) => {
        // i need to do a separate url call, the movie data does not include the stream provider list.
    };

    likeFilter(movie) {
        likesList = this.state.likes;

        for (let i = 0; i < likesList.length; i++) {
            //check if the movie and liked movie are the same
            if (likesList[i].movieID === movie.id) {
                return false;
            }
        }

        return true;
    }

    // callback function used by PlatformFilter
    selectedPlatformsCallback = (selected) => {

        this.setState({ selectedPlatforms: selected });
        // debugging to check that the component is returning the selected streaming platforms
        // console.log("setPlatforms: ", this.state.selectedPlatforms);
    };

    render() {
        return (
            <section className="movie">
                <div className="content">
                    <ToggleButton
                        value="check"
                        selected={this.state.showGenreOptions}
                        onChange={() => {
                            this.setState({
                                showGenreOptions: !this.state.showGenreOptions,
                            });
                            this.setState({ selectedGenre: 0 });
                        }}
                    >
                        <FilterListIcon />
                    </ToggleButton>
                    {this.filterByGenre(this.state.showGenreOptions)}

                    <PlatformFilter
                        platformCallback={this.selectedPlatformsCallback}
                    />

                    <div className="top">
                        <div className={this.className()}>
                            <div className="movie-display">
                                <div>
                                    <img
                                        className="movie-poster movie-visual"
                                        onClick={() => {
                                            this.displayData();
                                        }}
                                        src={this.state.poster_path}
                                        alt="Movie Poster"
                                    ></img>
                                </div>

                                <div className="like-dislike-btns">
                                    <div className="must-watch">
                                        <FavoriteIcon
                                            onClick={() => {
                                                this.mustWatchMovie();
                                                this.setMovie();
                                            }}
                                            sx={{ cursor: "pointer" }}
                                        />
                                    </div>
                                    &nbsp;&nbsp;
                                    <Button
                                        id="like-button"
                                        size="large"
                                        variant="contained"
                                        onClick={() => {
                                            this.likeMovie();
                                            this.setMovie();
                                        }}
                                    >
                                        LIKE
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        id="dislike-button"
                                        size="large"
                                        variant="contained"
                                        onClick={() => {
                                            this.setMovie();
                                        }}
                                    >
                                        DISLIKE
                                    </Button>
                                </div>
                            </div>
                            <div>
                                {this.state.showDescrption ? (
                                    <div id="minfo" className="movie-info">
                                        <h3>Description</h3>
                                        <p>{this.state.overview}</p>
                                        <h4>Release Date</h4>
                                        <p>{this.state.release}</p>
                                        <h4>Genre(s)</h4>
                                        <p>{this.state.genres}</p>
                                        <h4>Cast</h4>
                                        <p>{this.state.cast}</p>
                                    </div>
                                ) : (
                                    <div className="hidden"></div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        {this.state.showDescrption ? (
                            <div className="bottom">
                                <div className="movie-trailer">
                                    <h4>Trailer</h4>
                                    <div className="video-player">
                                        <YouTube
                                            videoId={this.state.movietrailer}
                                            className="youtube"
                                            opts={{
                                                width: "100%",
                                                height: "100%",
                                                playerVars: {
                                                    autoplay: 0,
                                                    controls: 1,
                                                    cc_load_policy: 0,
                                                    fs: 0,
                                                    iv_load_policy: 0,
                                                    modestbranding: 0,
                                                    rel: 0,
                                                    showinfo: 0,
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden"></div>
                        )}
                    </div>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            </section>
        );
    }
}
export default Movie;
