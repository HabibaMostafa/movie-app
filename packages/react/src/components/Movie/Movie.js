import React from "react";

async function movieDemo(callback) {
    fetch("/movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(),
    }).then((data) => {
        callback(data.json());
    });
}

// why javascript doesnt have randint function, =/
// min incl, max excl...
// function getRandInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const api_response = movieDemo((res) => {
//     res.then(function (data) {
//         console.log(data.body.results.length);

//         const random_movie =
//             data.body.results[getRandInt(0, data.body.results.length)];
//         const { title, poster_path, backdrop_path } = random_movie;

//         console.log(title);
//         console.log(poster_path);
//         console.log(backdrop_path);
//         // return <p>Movie here!!!...</p>;
//     });
// });

// this is getting called twice! idkwhy
class Movie extends React.Component {
    // idk why but I had to do a callback, + .then to access the data
    // return movieDemo((res) => {

    // const api_response = movieDemo((res) => {
    //     res.then(function (data) {
    //         console.log(data.body.results.length);

    //         const random_movie =
    //             data.body.results[getRandInt(0, data.body.results.length)];
    //         const { title, poster_path, backdrop_path } = random_movie;

    //         console.log(title);
    //         console.log(poster_path);
    //         console.log(backdrop_path);
    //         // return <p>Movie here!!!...</p>;
    //     });
    // });

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        // send HTTP request
        // save it to the state

        fetch("/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(),
        }).then((res) => {
            // callback(data.json());
            res.json().then((data) => {
                // this should be its own function
                const min = Math.ceil(0);
                const max = Math.floor(data.body.results.length-1);
                const index = Math.floor(Math.random() * (max - min + 1)) + min;

                const mov = data.body.results[index];

                console.log(mov);

                // probably a better way to destructure this
                this.setState({ title: mov.title });
                this.setState({
                    poster_path:
                        "https://image.tmdb.org/t/p/w300" + mov.poster_path,
                });
                this.setState({ overview: mov.overview });
                // this.setState({ title : mov.title });

                console.log(this.state.title);

                // console.log(data.body.results[0]);
            });
        });
    }
    render() {

            return (
                <div>
                    <h1>{this.state.title}</h1>
                    <img src={this.state.poster_path} alt="Movie Poster"></img>
                    <p>{this.state.overview}</p>
                </div>
            );

    }
}

export default Movie;
