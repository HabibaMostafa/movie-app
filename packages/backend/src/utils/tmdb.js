const request = require("request");

const axios = require("axios");

var page = 1;
const key = "c2e4c84ff690ddf904bc717e174d2c61";
const tmdb_url = "https://api.themoviedb.org/3";

const tmdb = (params, callback) => {
    page = params.pageNum;

    // const sure why its /3/...

    // gets first 4 pages of popular movies..
    // const url = https://api.themoviedb.org/3/movie/550?api_key=c2e4c84ff690ddf904bc717e174d2c61

    const sample_url = `${tmdb_url}/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate`;

    request({ url: sample_url, json: true }, (error, response) => {
        if (error) {
            callback("Bad tmdb request, please try again...", null);
            return;
        }

        // console.log(response);

        callback(null, response);
    });
};

const getMovie = async (id, callback) => {
    const getUrl = `${tmdb_url}/movie/${id}?api_key=${key}&append_to_response=videos`;
    // const getUrl = `https://api.themoviedb.org/3/movie/774825?api_key=c2e4c84ff690ddf904bc717e174d2c61&language=en-US`;

    request({ url: getUrl, json: true }, (error, response) => {
        if (error) {
            callback("Bad tmdb request, please try again...", null);
            return;
        }

        // console.log(response);

        callback(null, response);
    });
};

module.exports = { tmdb, getMovie };
