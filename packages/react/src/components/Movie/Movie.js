import React from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Movie.css";
import YouTube from "react-youtube";
import Tooltip from "@mui/material/Tooltip";

import _ from "underscore";

import Button from "@mui/material/Button";

import { getGenre, getGenreID } from "./Genre.js";
import { getLanguage, getLanguageISO } from "./Translations.js";
import { getPlatform, getPlatformId } from "./Platform.js";
import { getDecade, getDecadeId } from "./Decade.js";

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

import loading from "./loading.svg";
import { Construction } from "@mui/icons-material";

var movie;
let tempMovies = [];
var likesList = [];
var dislikesList = [];
var min;
var max;
var page = 1;
const movieIndex = [];
var index = 0;
var trailer = null;
var tempMovieTrailer;

let newMovieTrailer;
let newCast;
let newGenres;
let newTitle;
let newMovies;
let newPoster;
let newOverView;
let newRelease;
let newLanguage;
let showTheTrailer = false;
let dispayMovie = false;
let noMovies = false;

const genreList = [
    "Any",
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
    "Any",
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
    "Any",
    "English",
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
    "Punjabi",
];

const platformList = [
    "Any",
    "Netflix",
    "Disney Plus",
    "Amazon Prime Video",
    "Crave",
    "Crave Plus",
    "Crave Starz",
    "Google Play Movies",
    "Apple iTunes",
];

class Movie extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
        this.dispayMovie = false;
        this.state = {
            selectedGenre: 0,
            selectedDecade: 0,
            selectedLanguage: 0,
            selectedPlatform: 0,

            currentPage: 0,

            showLanguageOptions: false,
            showPlatformOptions: true,

            movies: [],
            dislikes: [],

            dataFetched: false,
            loadingMovie: false,
            showTrailer: false,
            filterListOpen: false,
            fetchedDislikes: false,
            dataLoaded: false,
            renderTrigger: new Date(),

            showTheMovie: false,
            noMatchesFound: false,
        };
    }

    resetAllFilters = () => {
        this.setState({ selectedDecade: 0 });
        this.setState({ selectedPlatform: 0 });
        this.setState({ selectedLanguage: 0 });
        this.setState({ selectedGenre: 0 });
        // this.getNewList();
        this.handleClose();
        this.componentDidMount();
    };

    hideMovie = () => {
        dispayMovie = false;
        this.setState({ renderTrigger: new Date(), showTheMovie: false });
        // this.setState()
    };
    showMovie = () => {
        dispayMovie = true;
        this.setState({ renderTrigger: new Date(), showTheMovie: true });
        // this.setState()
    };

    componentDidMount() {
        // this.dispayMovie = false;
        //setstate here?

        document.addEventListener("keydown", this.handleKeyPress, false);

        // start at the beginning of the page because the server sent new data
        index = 0;

        const pageBeforeStateChange = page;

        const params = {
            pageNum: page,
            platform: this.state.selectedPlatform,
            genre: this.state.selectedGenre,
            decade: this.state.selectedDecade,
            language: this.state.selectedLanguage,
        };

        //get a list of previously "liked" movies

        // const toastData = () => (
        //     <div>
        //         <p>No movies match selected filters.</p>
        //     </div>
        // );
        // toast.info(toastData);

        // if(this.state.noMatchesFound) {
        //     return;
        // }

        axios.post("/movies", params).then((res) => {
            if (res.status === 200) {
                index = 0;
                this.tempMovies = res.data;

                // console.log(res.data.body.results.length);

                // if (res.data.body.results.length < 1) {
                //     const toastData = () => (
                //         <div>No movies match selected filters.</div>
                //     );
                //     toast.info(toastData);
                //     this.setState({noMatchesFound: true})

                // }
            } else {
                this.tempMovies = [];

                // notification that submitted filters
                // const toastData = () => (
                //     <div>No movies match selected filters.</div>
                // );
                // toast.info(toastData);
            }

            // get likes
            axios.get(`/votes?user=${this.props._id}`).then((result1) => {
                if (result1.status === 200) {
                    likesList = result1.data;
                } else {
                    likesList = [];
                }

                // get dislikes
                axios
                    .get(`/dislikes?user=${this.props._id}`)
                    .then((result2) => {
                        if (result2.status === 200) {
                            // this.setState({ dislikes: result.data });
                            dislikesList = result2.data;
                        } else {
                            dislikesList = [];
                        }

                        page = pageBeforeStateChange;
                        this.setTheMovie();
                    });
            });
        });
    }

    waitForLikes = async () => {
        const likes = await this.getLikedList().then((result) => {
            return result;
        });
        // return likes;
    };

    getNewPage = async () => {
        index = 0;

        const pageBeforeStateChange = page;

        const params = {
            pageNum: page,
            platform: this.state.selectedPlatform,
            genre: this.state.selectedGenre,
            decade: this.state.selectedDecade,
            language: this.state.selectedLanguage,
        };
        this.setState({ showDescrption: true });
        let tempLikes;
        let tempDislikes;

        axios
            .post("/movies", params)
            .then((res) => {
                if (res.status === 200) {
                    index = 0;
                    this.setState({ movies: res.data });
                } else {
                    this.setState({ movies: [] });
                }
            })
            // .then(() => this.getLikedList())
            .then(() => {
                tempLikes = this.getLikedList();
            })
            // .then(() => this.getDislikedList())
            .then(() => {
                tempDislikes = this.getDislikedList();
            })
            .then(() => {
                page = pageBeforeStateChange;
                this.setMovie();
            });
        // .then(() =>
        //     this.setState({
        //         dataLoaded: true,
        //         likes: tempLikes,
        //         dislikes: tempDislikes,
        //     })
        // );

        // console.log(this.tempMovies)
        // if(this.tempMovies.length < 1) {
        //     const toastData = () => (
        //         <div>
        //             <p>No movies match the selected filters.</p>
        //         </div>
        //     );
        //     toast.info(toastData);
        // }
    };

    setSelectedGenre = (selection) => {
        if (
            selection === undefined ||
            selection === null ||
            selection === "Any"
        ) {
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
        if (
            selection === undefined ||
            selection === null ||
            selection === "Any"
        ) {
            this.setState({ selectedLanguage: 0 }, () => {
                return;
            });
        } else {
            let language = getLanguageISO(selection);
            this.setState({ selectedLanguage: language }, () => {
                return;
            });
        }
    };

    setSelectedPlatform = (selection) => {
        if (
            selection === undefined ||
            selection === null ||
            selection === "Any"
        ) {
            this.setState({ selectedPlatform: 0 }, () => {
                return;
            });
        } else {
            let platform = getPlatformId(selection);
            this.setState({ selectedPlatform: platform }, () => {
                return;
            });
        }
    };

    setSelectedDecade = (selection) => {
        if (
            selection === undefined ||
            selection === null ||
            selection === "Any"
        ) {
            this.setState({ selectedDecade: 0 }, () => {
                return;
            });
        } else {
            let decade = getDecadeId(selection);
            this.setState({ selectedDecade: decade }, () => {
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
                    defaultValue={getGenre(this.state.selectedGenre)}
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

    filterByLanguage = () => {
        return (
            <Stack spacing={3} sx={{ width: 300 }}>
                <Autocomplete
                    id="tags-standard"
                    options={languageList}
                    defaultValue={getLanguage(this.state.selectedLanguage)}
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
                    defaultValue={getDecade(this.state.selectedDecade)}
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
                    id="tags-standard"
                    options={platformList}
                    defaultValue={getPlatform(this.state.selectedPlatform)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                    )}
                    onChange={(e, selection) => {
                        this.setSelectedPlatform(selection);
                    }}
                />
            </Stack>
        );
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
        let tempData;

        await axios.get(`/votes?user=${this.props._id}`).then((result) => {
            if (result.status === 200) {
                // this.setState({ likes: result.data });
                // console.log(result.data);
                tempData = result.data;
            }
        });

        return tempData;
    };

    getDislikedList = async () => {
        await axios.get(`/dislikes?user=${this.props._id}`).then((result) => {
            if (result.status === 200) {
                // this.setState({ dislikes: result.data });
                return result.data;
            }
        });
    };

    dislikeMovie = async () => {
        let userId = this.props._id;

        let data = { id: movie.id, user: userId };

        axios.post("/dislikes", { data }).then((response) => {});
    };

    //set a movie to display based on what the next number in the movieIndex is.
    setTheMovie = async (tempMovies) => {
        if (this.state.noMatchesFound) {
            this.setState({ noMatchesFound: false });
            return this.componentDidMount();
        }

        if (
            this.tempMovies.length < 1 ||
            this.tempMovies === undefined ||
            this.tempMovies === []
        ) {
            return;
        }

        let elementsOnThisPage = this.tempMovies.body.results.length;
        let totalResults = this.tempMovies.body.total_results;
        let totalPages = this.tempMovies.body.total_pages;

        console.log("results, ", totalResults);

        if (totalResults < 3) {
            this.setState({
                selectedDecade: 0,
                selectedPlatform: 0,
                selectedLanguage: 0,
                selectedGenre: 0,
                noMatchesFound: true,
            });

            return this.componentDidMount();
        }

        let filters = false;

        try {
            while (filters === false) {
                this.dispayMovie = false;
                movie = this.tempMovies.body.results[index];

                if (
                    this.dislikeCheck(movie) === true &&
                    this.likeCheck(movie) === true
                ) {
                    filters = true;
                } else {
                    index++;

                    // get the next page if you ran out of elements on the current page

                    if (index >= elementsOnThisPage) {
                        // console.log("while, new page", index, page);

                        page++;
                        index = 0;

                        // const toastData = () => (
                        //     <div>
                        //         <p>No movies match selected filters.</p>
                        //     </div>
                        // );
                        // toast.info(toastData);

                        // if(this.state.noMatchesFound) {
                        //     return;
                        // }

                        // loop to the beginning
                        if (page >= totalPages) {
                            page = 1;
                        }
                        this.hideMovie();
                        return this.componentDidMount();
                    }
                }
            }

            //grab genre ids then convert and save genre names
            var genreIDArr = movie.genre_ids;
            var genresArr = [];
            for (let g = 0; g < genreIDArr.length; g++) {
                genresArr.push(getGenre(genreIDArr[g]));
            }

            // await this.setState({ genres: genresArr.join(", ") });
            //setState is called in the below function for movietrailer

            // await this.getMovieTrailerID(movie.id);

            const apiKey = "c2e4c84ff690ddf904bc717e174d2c61";
            const tmdb_url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`;

            // get the youtube key
            axios.get(tmdb_url).then((res) => {
                if (res.data.results.length < 1) {
                    tempMovieTrailer = "";
                } else {
                    tempMovieTrailer = res.data.results[0].key;
                }

                // get the cast
                const url_cast = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=en-US`;

                axios.get(url_cast).then((res) => {
                    // console.log(res.data);

                    let tempCast;
                    let finalCast;

                    const castMembers = res.data.cast.length;

                    if (
                        res.data === undefined ||
                        res.data === null ||
                        castMembers < 1
                    ) {
                        finalCast = "";
                    } else {
                        tempCast = res.data.cast;

                        let castString = tempCast[0].name;

                        // only show top 10 actors
                        if (tempCast.length < 10) {
                            for (let i = 1; i < tempCast.length; i++) {
                                castString = castString.concat(
                                    ", " + tempCast[i].name
                                );
                            }
                        } else {
                            for (let i = 1; i < 10; i++) {
                                castString = castString.concat(
                                    ", " + tempCast[i].name
                                );
                            }
                        }

                        finalCast = castString;
                    }

                    index++;
                    // get the next page if you ran out of elements on the current page
                    if (index >= elementsOnThisPage) {
                        page++;
                        index = 0;

                        // loop to the beginning
                        if (page >= totalPages) {
                            page = 1;
                        }
                        // console.log("other new page ")
                        this.hideMovie();
                        return this.componentDidMount();
                    } else {
                        // console.log(index)
                        // this.dispayMovie = false;

                        this.newMovieTrailer = tempMovieTrailer;
                        this.newCast = finalCast;
                        this.newGenres = genresArr.join(", ");
                        this.newTitle = movie.title;
                        this.newMovies = tempMovies;
                        this.newPoster =
                            "https://image.tmdb.org/t/p/w300" +
                            movie.poster_path;
                        this.newOverView = movie.overview;
                        this.newRelease = movie.release_date;
                        this.newLanguage = movie.original_language;

                        this.showMovie();
                    }
                });
            });
        } catch (error) {
            let totalPages = this.movies.body.total_pages;
            // let totalPages = this.state.movies.body.total_pages;

            if (page + 1 > totalPages) {
                this.setState({ showMovie: false });

                page = 1;
                index = 0;
            } else {
                page++;
                index = 0;

                //grab another page
                this.getNewPage();
            }

            console.log(error);
        }
    };

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

        await axios.post("/matches/vote", params).then((response) => {
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

        await axios.post("/matches/vote", params).then((response) => {
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

    getMovieTrailerID = async (movieId) => {
        // await this.setState({ showTrailer: false });

        const apiKey = "c2e4c84ff690ddf904bc717e174d2c61";
        const tmdb_url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

        await axios.get(tmdb_url).then((res) => {
            // hmm results[0] is UK, and results[1] is US... i'm
            // just getting the first element to be safe

            if (res.data.results.length < 1) {
                this.setState({ movietrailer: "" });
                return;
            }

            let youtubeKey = res.data.results[0].key;

            this.setState({ movietrailer: youtubeKey });
            this.setState({ showTrailer: true });
        });
    };

    getMovieCast = async (movieId) => {
        const apiKey = "c2e4c84ff690ddf904bc717e174d2c61";
        const tmdb_url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;

        await axios.get(tmdb_url).then((res) => {
            // console.log(res.data);
            const castMembers = res.data.cast.length;

            if (
                res.data === undefined ||
                res.data === null ||
                castMembers < 1
            ) {
                this.setState({ cast: "" });
                return;
            }

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
        var genreIDArr = movie.genre_ids;

        if (this.state.selectedGenre !== 0) {
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

        if (this.state.selectedLanguage !== 0) {
            if (movieLanguage === getLanguageISO(this.state.selectedLanguage)) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

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

        if (this.state.selectedDecade !== 0) {
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

    // returns false if movie has already been liked
    likeFilter(movie) {
        likesList = this.state.likes;

        if (likesList === undefined || movie === undefined) {
            return false;
        }

        for (let i = 0; i < likesList.length; i++) {
            //check if the movie and liked movie are the same
            if (likesList[i].movieID === movie.id) {
                return false;
            }
        }

        return true;
    }

    likeCheck(movie) {
        // console.log("list", likesList)

        for (let i = 0; i < likesList.length; i++) {
            //check if the movie and liked movie are the same
            if (likesList[i].movieID === movie.id) {
                return false;
            }
        }

        return true;
    }

    dislikeCheck(movie) {
        // console.log("dislike list", dislikesList)

        for (let i = 0; i < dislikesList.length; i++) {
            // console.log("dislike list", dislikesList)
            if (dislikesList[i].movieId === movie.id) {
                return false;
            }
        }

        return true;
    }

    // not used?
    applyFilteringBtn = () => {
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
        page = 1;

        this.handleClose();

        this.componentDidMount();
    };

    handleKeyPress = (e) => {
        let key = e.key;
        console.log(key);

        if (key === "d" || key === "ArrowRight") {
            //Dislike movie
            this.dislikeMovie();
            this.setTheMovie();
        } else if (key === "a" || key === "ArrowLeft") {
            //Like movie
            this.likeMovie();
            this.setTheMovie();
        } else if (key === "w") {
            //must watch movie
            this.mustWatchMovie();
            this.setTheMovie();
        } else if (key === "e") {
            //show description
            this.displayData();
        } else if (key === "s") {
            //skip movie
            this.setTheMovie();
        }
    };

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    handleClickOpen = () => {
        this.setState({ filterListOpen: true });
    };

    handleClose = () => {
        this.setState({ filterListOpen: false });
    };

    render() {
        // console.log("state", this.state.noMatchesFound);

        // console.log(noMovies)
        if (this.state.noMatchesFound) {
            const toastData = () => (
                <div>
                    <p>No movies found, filters reset to default.</p>
                </div>
            );

            toast.info(toastData);
        }

        // console.log("render call", this.state.showTheMovie, new Date().getSeconds(), index);
        if (this.state.showTheMovie === false) {
            return (
                <div>
                    <h3>Loading movies please wait</h3>
                    <img src={loading} alt="loading animation"></img>
                </div>
            );
        } else {
            return (
                <section className="movie">
                    <div>
                        <Tooltip title="Filter">
                            <ToggleButton
                                value="check"
                                onClick={this.handleClickOpen}
                            >
                                <FilterListIcon
                                    className="svg_icons"
                                    style={{ fontSize: 15 }}
                                />
                            </ToggleButton>
                        </Tooltip>

                        <Dialog
                            open={this.state.filterListOpen}
                            onClose={this.handleClose}
                        >
                            <DialogContent sx={{ background: "#242424" }}>
                                <p>Genre</p>
                                {this.filterByGenre(
                                    this.state.showGenreOptions
                                )}

                                <p>Platform</p>
                                {this.filterByPlatform(
                                    this.state.showPlatformOptions
                                )}

                                <p>Decade</p>
                                {this.filterByDecade(
                                    this.state.showDecadeOptions
                                )}

                                <p>Language</p>
                                {this.filterByLanguage(
                                    this.state.showLanguageOptions
                                )}
                            </DialogContent>
                            <DialogActions sx={{ background: "#242424" }}>
                                <Button onClick={this.handleClose}>
                                    Cancel
                                </Button>
                                <Button onClick={this.getNewList}>Apply</Button>
                            </DialogActions>
                        </Dialog>
                    </div>

                    {this.state.showTheMovie ? (
                        // {this.state.showMovie ? (
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
                                                src={this.newPoster}
                                                // src={this.state.poster_path}
                                                sx={{ cursor: "pointer" }}
                                                alt="Movie Poster"
                                            ></img>
                                        </div>

                                        <div className="like-dislike-btns">
                                            <div className="must-watch">
                                                <FavoriteIcon
                                                    id="mustwatch-button"
                                                    onClick={() => {
                                                        this.mustWatchMovie();
                                                        this.setTheMovie();
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
                                                    this.setTheMovie();
                                                }}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                LIKE
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                id="skip-button"
                                                size="large"
                                                variant="contained"
                                                onClick={() => {
                                                    this.setTheMovie();
                                                }}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Skip
                                            </Button>
                                            &nbsp;&nbsp;
                                            <Button
                                                id="dislike-button"
                                                size="large"
                                                variant="contained"
                                                onClick={() => {
                                                    this.dislikeMovie();
                                                    this.setTheMovie();
                                                }}
                                                sx={{ cursor: "pointer" }}
                                            >
                                                DISLIKE
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        {this.state.showDescrption ? (
                                            <div
                                                id="minfo"
                                                className="movie-info"
                                            >
                                                <h3 className="movie-title">
                                                    {this.state.title}
                                                </h3>
                                                <h3>Description</h3>
                                                <p>{this.newOverVieww}</p>
                                                {/* <p>{this.state.overview}</p> */}
                                                <h4>Release Date</h4>
                                                <p>{this.newRelease}</p>
                                                {/* <p>{this.state.release}</p> */}
                                                <h4>Genre(s)</h4>
                                                <p>{this.newGenres}</p>
                                                {/* <p>{this.state.genres}</p> */}
                                                <h4>Cast</h4>
                                                <p>{this.newCast}</p>
                                                {/* <p>{this.state.cast}</p> */}
                                                <h4>Language</h4>
                                                <p>
                                                    {getLanguage(
                                                        String(
                                                            this.newLanguage
                                                            // this.state.language
                                                        )
                                                    )}
                                                </p>
                                                <br></br>
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
                                        {this.state.showTheMovie &&
                                        this.newMovieTrailer.length > 0 ? (
                                            // {this.state.showTrailer ? (
                                            <div className="movie-trailer">
                                                <h4>Trailer</h4>
                                                <div className="video-player">
                                                    <YouTube
                                                        videoId={
                                                            this.newMovieTrailer
                                                            // this.state
                                                            //     .movietrailer
                                                        }
                                                        className="youtube"
                                                        onError={(e) => {
                                                            console.log(e);
                                                        }}
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
                                        ) : (
                                            <div className="movie-trailer">
                                                Trailer is unavailable
                                            </div>
                                        )}
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
                            <h2>
                                {/* Out of Movies, Maybe try a different filter? */}
                            </h2>
                        </div>
                    )}
                </section>
            );
        }
    }
}
export default Movie;
