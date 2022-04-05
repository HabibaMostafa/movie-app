const request = require("request");

const axios = require("axios");

var page = 1;
const key = "c2e4c84ff690ddf904bc717e174d2c61";
const tmdb_url = "https://api.themoviedb.org/3";

const tmdb = (params, callback) => {
    page = params.pageNum;

    let genreQuery = "";
    let platformQuery = "";

    if (params.genre !== 0) {
        genreQuery = "&with_genres=" + params.genre.toString();
    }

    // console.log("The params are:", params);
    // console.log(params.platforms.length);

    const numPlatforms = params.platforms.length;

    if (numPlatforms > 0) {
        let streamProviders = "";

        for (let i = 0; i < numPlatforms; i++) {
            if (i === 0) {
                streamProviders = streamProviders + params.platforms[i].id;
            } else {
                streamProviders =
                    streamProviders + "|" + params.platforms[i].id;
            }
        }

        // platformQuery = `&with_watch_providers=8|119|337&watch_region=CA`
        platformQuery = `&with_watch_providers=${streamProviders}&watch_region=CA`;
    }
    // if(params)

    // console.log(genreQuery);
    // console.log(platformQuery);

    // platforms
    // genres

    // &with_watch_providers=

    // const sure why its /3/...

    // gets first 4 pages of popular movies..
    // const url = https://api.themoviedb.org/3/movie/550?api_key=c2e4c84ff690ddf904bc717e174d2c61

    // &with_watch_monetization_types=flatrate&with_watch_providers=8|119|337&watch_region=CA

    const sample_url = `${tmdb_url}/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate${genreQuery}${platformQuery}`;

    // console.log(sample_url)

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
