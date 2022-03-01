const request = require("request");

const tmdb = (params, callback) => {
    const key = "c2e4c84ff690ddf904bc717e174d2c61";

    // const sure why its /3/...
    const tmdb_url = "https://api.themoviedb.org/3";

    // gets first 4 pages of popular movies..
    // const url = https://api.themoviedb.org/3/movie/550?api_key=c2e4c84ff690ddf904bc717e174d2c61

    const sample_url = `${tmdb_url}/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;

    request({ url: sample_url, json: true }, (error, response) => {
        if (error) {
            callback("Bad tmdb request, please try again...", null);
            return;
        }

        // console.log(response);

        callback(null, response);
    });
};

// sd

module.exports = tmdb;
