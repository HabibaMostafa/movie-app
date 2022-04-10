import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Movie.css";
import YouTube from "react-youtube";

import _ from "underscore";

import Button from "@mui/material/Button";
import { getGenre, getGenreID } from "./Genre.js";
import { getLanguage, getLanguageISO } from "./Translations.js";

import FilterListIcon from "@mui/icons-material/FilterList";
import ToggleButton from "@mui/material/ToggleButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

const decadeList = [
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
];

const languageList = [
    "French",
    "Italian",
    "Japanese",
    "Korean",
    "Latin",
    "Dutch",
    "Russian",
    "Spanish",
    "Turkish",
    "Arabic",
    "English",
    "Punjabi",
];

const platformList = [
    { name: "Netflix", id: 8 },
    { name: "Disney Plus", id: 337 },
    { name: "Amazon Prime Video", id: 119 },
    { name: "Crave", id: 230 },
    { name: "Crave Plus", id: 231 },
    { name: "Crave Starz", id: 305 },
    { name: "Google Play Movies", id: 3 },
    { name: "Apple iTunes", id: 2 },
];

class Movie extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
        this.state = {
            selectedGenre: 0,
            selectedPlatforms: [],
            selectedDecade: 0,
            selectedLanguage: 0,
            dataFetched: false,
            movies: [],
            filterListOpen: false,
            userSelectedPlatforms: [],
            showPlatformOptions: true,
        };
    }

    resetAllFilters = () => {
        this.setState({ selectedPlatforms: [] });
        this.setState({ selectedDecade: 0 });
        this.setState({ selectedLanguage: 0 });
        this.setState({ userSelectedPlatforms: [] });
        this.handleClose();
        this.getNewList();


    };

    componentDidMount() {
        // need to start at the first page on every new api call

        // let oldPage = page
        // page = 1;

        // start at the beginning of the page
        index = 0;

        const params = {
            pageNum: page,
            platforms: this.state.selectedPlatforms,
            genre: this.state.selectedGenre,
            decade: this.state.selectedDecade,
            language: getLanguageISO(this.state.selectedLanguage),
        };
        this.setState({ showDescrption: true });

        //get a list of previously "liked" movies
        this.getLikedList();

        axios
            .post("/movies", params)
            .then((res) => {
                if (res.status === 200) {
                    index = 0;
                    this.setState({ movies: res.data });

                    //create a list of movies to display in carousel
                    // this.setMovieIndex();

                    //set the next movie to display
                    // this.setMovie();
                    // console.log(movies: res.data)
                } else {
                    this.setState({ movies: [] });
                }
            })
            .then(() => this.setMovieIndex())
            .then(() => {
                this.setMovie();
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

    setSelectedLanguage = (selection) => {
        if (selection === undefined || selection === null) {
            this.setState({ selectedLanguage: 0 }, () => {
                return;
            });
        } else {
            this.setState({ selectedLanguage: selection }, () => {
                return;
            });
        }
    };

    setSelectedDecade = (selection) => {
        if (selection === undefined || selection === null) {
            this.setState({ selectedDecade: 0 }, () => {
                return;
            });
        } else {
            this.setState({ selectedDecade: selection }, () => {
                return;
            });
        }
    };

    filterByGenre = () => {
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
    };


    //filterByLanguage = (show) => {

    filterByLanguage = () => {
        return (
            <Stack spacing={3} sx={{ width: 300 }}>
                <Autocomplete
                    id="tags-standard"
                    options={languageList}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                    )}
                    onChange={(e, selection) => {
                        this.setSelectedLanguage(selection);
                    }}
                />
            </Stack>
        );
    };

    filterByDecade = () => {
        return (
            <Stack spacing={3} sx={{ width: 300 }}>
                <Autocomplete
                    id="tags-standard"
                    options={decadeList}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                    )}
                    onChange={(e, selection) => {
                        this.setSelectedDecade(selection);
                    }}
                />
            </Stack>
        );
    };

    filterByPlatform = () => {
        return (
            <Stack spacing={3} sx={{ width: 300 }}>
                <Autocomplete
                    multiple
                    id="tags-standard"
                    options={platformList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                    )}
                    onChange={(e, selection) => {
                        this.platformSelectionHandler(selection);
                    }}
                />
            </Stack>
        );
    };

    // await is needed here
    platformSelectionHandler = async (newSelection) => {
        await this.setState({ userSelectedPlatforms: newSelection });
        await this.props.platformCallback(this.state.userSelectedPlatforms);
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
        if (
            this.state.movies.length < 1 ||
            this.state.movies === undefined ||
            this.state.movies === []
        ) {
            // if(!this.state.dataFetched) {
            return;
        }

        let elementsOnThisPage = this.state.movies.body.results.length;
        let totalPages = this.state.movies.body.total_pages;

        movie = this.state.movies.body.results[index];

        // movie = this.state.movies.body.results[movieIndex[index]];

        var filters = false;

        try {
            while (
                filters === false 
                // this.state.availablePlatforms.length > 0
                // filters === false &&
                // this.state.availablePlatforms.length > 0
            ) {
                if (
                    // this.streamFilter(movie) === true <--  not needed, the post request does it already -Miles
                    this.genreFilter(movie) === true &&
                    this.decadeFilter(movie) === true &&
                    this.languageFilter(movie) === true &&
                    this.likeFilter(movie) === true
                ) {
                    filters = true;
                } else {
                    //get new movie
                    index++;
                    // if (index >= max) {
                    if (index >= elementsOnThisPage) {
                        page++;

                        // loop to the beginning
                        if (page > totalPages) {
                            // console.log("out of movies" );
                            // this.setState({ showMovie: false });
                            page = 1;
                            index = 0;
                        } else {
                            index = 0;
                            this.componentDidMount();
                        }
                    }

                    movie = this.state.movies.body.results[index];
                    // movie = this.state.movies.body.results[movieIndex[index]];
                }
            }

            this.setState({ title: movie.title });
            this.setState({
                poster_path:
                    "https://image.tmdb.org/t/p/w300" + movie.poster_path,
            });
            this.setState({ overview: movie.overview });
            this.setState({ release: movie.release_date });
            this.setState({ language: movie.original_language });

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

            this.setState({ showMovie: true });

            index++;
        } catch (error) {
            // we enter this error branch if the user presses dislike or like too fast
            // leading to the page getting stuck
            // calling componentDidMount() again fixes the problem
            // page++;

            // we can error check here if page is >= the number of pages specified in the data sent frfom the server

            let totalPages = this.state.movies.body.total_pages;

            if (page + 1 > totalPages) {
                console.log(page);
                console.log(totalPages);
                console.log(index);
                console.log("out of movies. Error: " + error);
                this.setState({ showMovie: false });
                page = 1;
                index = 0;
            } else {
                page++;
                index = 0;
                this.componentDidMount();
            }

            // console.log("total pages: ", this.state.movies.body.total_pages);
        }
    }

    //method for when the user "likes" the movie on display
    likeMovie = async () => {
        let userID = this.props._id;

        let data = JSON.stringify({
            id: movie.id,
            user: userID,
            username: this.props.username,
            title: movie.title,
            poster: movie.poster_path,
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

        console.log(params);

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
            username: this.props.username,
            title: movie.title,
            poster: movie.poster_path,
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
        console.log("LOL");

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

    languageFilter(movie) {
        var movieLanguage = movie.original_language;

        if (this.state.selectedLanguage != 0) {
            if (movieLanguage === getLanguageISO(this.state.selectedLanguage)) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

    //platformFilter = async (movie) => {
    //    // i need to do a separate url call, the movie data does not include the stream provider list.
    //};

    decadeFilter(movie) {
        var movieDate = movie.release_date.split("-");
        var decadeStart = null;
        var decadeEnd = null;

        switch (this.state.selectedDecade) {
            case "1950s":
                decadeStart = 1950;
                decadeEnd = 1959;
                break;
            case "1960s":
                decadeStart = 1960;
                decadeEnd = 1969;
                break;
            case "1970s":
                decadeStart = 1970;
                decadeEnd = 1979;
                break;
            case "1980s":
                decadeStart = 1980;
                decadeEnd = 1989;
                break;
            case "1990s":
                decadeStart = 1990;
                decadeEnd = 1999;
                break;
            case "2000s":
                decadeStart = 2000;
                decadeEnd = 2009;
                break;
            case "2010s":
                decadeStart = 2010;
                decadeEnd = 2019;
                break;
            case "2020s":
                decadeStart = 2020;
                decadeEnd = 2029;
                break;
            default:
                decadeStart = null;
                decadeEnd = null;
        }

        if (this.state.selectedDecade != 0) {
            if (
                parseInt(movieDate[0]) <= decadeEnd &&
                parseInt(movieDate[0]) >= decadeStart
            ) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

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

    applyFilteringBtn = () => {
        page = 1;
        // index = 0;
        return (
            <div>
                <Button
                    onClick={() => {
                        this.getNewList();
                    }}
                >
                    Apply Filtering
                </Button>
            </div>
        );
    };

    getNewList = () => {
        this.handleClose();
        this.componentDidMount();
    };

    handleClickOpen = () => {
        this.setState({ filterListOpen: true });
    };

    handleClose = () => {
        this.setState({ filterListOpen: false });
    };

    render() {
        return (
            <section className="movie">
                <div>

                    <ToggleButton value="check" onClick={this.handleClickOpen}>
                        <FilterListIcon />
                    </ToggleButton>

                    <Dialog
                        open={this.state.filterListOpen}
                        onClose={this.handleClose}
                    >
                        <DialogTitle sx={{ background: "#242424" }}>
                            Set Filters
                        </DialogTitle>
                        <DialogContent sx={{ background: "#242424" }}>
                            <p>Genre</p>
                            {this.filterByGenre(this.state.showGenreOptions)}

                            <p>Platform</p>
                            {this.filterByPlatform(
                                this.state.showPlatformOptions
                            )}

                            <p>Decade</p>
                            {this.filterByDecade(this.state.showDecadeOptions)}

                            <p>Language</p>
                            {this.filterByLanguage(
                                this.state.showLanguageOptions
                            )}
                        </DialogContent>
                        <DialogActions sx={{ background: "#242424" }}>
                            <Button onClick={this.resetAllFilters}>Reset Filters</Button>
                            <Button onClick={this.handleClose}>Cancel</Button>
                            <Button onClick={this.getNewList}>Apply</Button>
                        </DialogActions>
                    </Dialog>

                </div>
                {this.state.showMovie ? (
                    <div className="content">
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
                                                // this.likeMovie();
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
                                                // index++;
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
                                            <h4>Language</h4>
                                            <p>
                                                {getLanguage(
                                                    String(this.state.language)
                                                )}
                                            </p>
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
                                                videoId={
                                                    this.state.movietrailer
                                                }
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
                ) : (
                    <div>
                        <h2>Out of Movies, Maybe try a different filter?</h2>
                    </div>
                )}
            </section>
        );
    }
}
export default Movie;
