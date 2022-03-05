import React from "react";
import axios from "axios";

class MovieListElement extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        // this.state = { userFriends: [] };
        // this.userToAdd = null;
        this.state = { id: "", title: "", poster: "" };
    }
    componentDidMount() {}

    render() {
        return (
            <div class="movie-list-element">
                <p>{this.props.movieID}</p>
            </div>
        );
    }
}

export default MovieListElement;
