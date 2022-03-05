import React from "react";
import axios from "axios";

class MovieListElement extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        // this.state = { userFriends: [] };
        // this.userToAdd = null;
        this.state = { id: "", title: "", poster: "", movie: [] };
    }
    componentDidMount() {
        axios.get(`/movies?id=${this.props.movieID}`).then((result) => {
            if (result.status === 200) {
                // console.log(result);

                this.setState({ movie: result.data.body });
                this.setState({
                    poster:
                        "https://image.tmdb.org/t/p/w200" +
                        result.data.body.poster_path,
                });
            }
        });
    }

    render() {
        // console.log(this.state.movie.length === 0)
        if (this.state.movie.length === 0) {
            // maybe return a loading animation gif?
            return <div></div>;
        } else {
            return (
                <div class="movie-list-element">
                    <img src={this.state.poster} alt="Movie Poster"></img>
                </div>
            );
        }
    }
}

export default MovieListElement;
