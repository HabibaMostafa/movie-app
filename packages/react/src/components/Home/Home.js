import React from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

var page = 1;

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDecadeOptions: false,
            selectedDecade: 0,
        };
    }

    componentDidMount() {
        // need to start at the first page on every new api call
        page = 1;

        const params = {
            pageNum: page,
            platform: 0,
            genre: 0,
            decade: 0,
            language: 0,
        };

        axios.post("/movies", params).then((res) => {
            if (res.status === 200) {
                this.setState({ movies: res.data });

                this.setState({ showMovie: true });
            } else {
                this.setState({ movies: [] });
                this.setState({ showMovie: false });
            }
        });
    }

    render() {
        return (
            <section className="movie">
                {this.state.showMovie ? (
                    <div className="home-content">
                        <div className="top">
                            <div className="row">
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[0]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[0]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[0].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[1]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[1]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[1].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[2]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[2]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[2].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[3]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[3]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[3].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[4]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[4]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[4].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[5]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[5]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[5].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[6]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[6]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[6].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                                <div className="column">
                                    <img
                                        className="movie-poster movie-visual"
                                        src={
                                            "https://image.tmdb.org/t/p/w300" +
                                            this.state.movies.body.results[7]
                                                .poster_path
                                        }
                                        alt="Movie Poster"
                                    ></img>
                                    <h4 className="title">
                                        {
                                            this.state.movies.body.results[7]
                                                .title
                                        }
                                    </h4>
                                    <p>
                                        {this.state.movies.body.results[7].release_date.slice(
                                            0,
                                            4
                                        )}
                                    </p>
                                </div>
                            </div>
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
                        <h2>Network Error: No Movies Found.</h2>
                    </div>
                )}
            </section>
        );
    }
}
export default HomePage;
