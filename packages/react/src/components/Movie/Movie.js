import React from "react";

class Movie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch("/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        }).then((res) => {
            //// callback(data.json());
            res.json().then((data) => {
                //// this should be its own function
                const min = Math.ceil(0);
                const max = Math.floor(data.body.results.length - 1);
                const index = Math.floor(Math.random() * (max - min + 1)) + min;
                const coverSize = 300;

                const mov = data.body.results[index];

                console.log(mov);

                //// probably a better way to destructure this
                this.setState({ title: mov.title });
                this.setState({
                    poster_path:
                        "https://image.tmdb.org/t/p/w300" + mov.poster_path,
                });
                this.setState({ overview: mov.overview });
                //// this.setState({ title : mov.title });

                console.log(this.state.title);

            });
        });
    }
    render() {
        return (
            <div className="movie-info">
                <h3>{this.state.title}</h3>
                <img src={this.state.poster_path} alt="Movie Poster"></img>
                <p>{this.state.overview}</p>
            </div>
        );
    }
}

export default Movie;
