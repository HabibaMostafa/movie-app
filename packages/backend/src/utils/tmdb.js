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
                streamProviders = streamProviders + params.platforms[i].id + "|" + params.platforms[i].name ;
            } else {
                streamProviders =
                    streamProviders + "|" + params.platforms[i].id;
            }
        }

        // platformQuery = `&with_watch_providers=8|119|337&watch_region=CA`
        platformQuery = `&with_watch_providers=${streamProviders}&watch_region=CA`;
    }
    // if(params)

    // get movies of a certain decade...

    // "1950s",
    // "1960s",
    // "1970s",
    // "1980s",
    // "1990s",
    // "2000s",
    // "2010s",
    // "2020s",

    const decadeDictionary = {
        "1950s":
            "&primary_release_year=1950|1951|1952|1953|1954|1955|1956|1957|1958|1959",
        "1960s":
            "&primary_release_year=1960|1961|1962|1963|1964|1965|1966|1967|1968|1969",
        "1970s":
            "&primary_release_year=1970|1971|1972|1973|1974|1975|1976|1977|1978|1979",
        "1980s":
            "&primary_release_year=1980|1981|1982|1983|1984|1985|1986|1987|1988|1989",
        "1990s":
            "&primary_release_year=1990|1991|1992|1993|1994|1995|1996|1997|1998|1999",
        "2000s":
            "&primary_release_year=2000|2001|2002|2003|2004|2005|2006|2007|2008|2009",
        "2010s":
            "&primary_release_year=2010|2011|2012|2013|2014|2015|2016|2017|2018|2019",
        "2020s":
            "&primary_release_year=2020|2021|2022|2023|2024|2025|2026|2027|2028|2029",
        0: "",
    };

    const yearQuery = decadeDictionary[params.decade];
    // console.log(yearQuery);

    // console.log(genreQuery);
    // console.log(platformQuery);

    // platforms
    // genres

    // &with_watch_providers=

    // const sure why its /3/...

    // gets first 4 pages of popular movies..
    // const url = https://api.themoviedb.org/3/movie/550?api_key=c2e4c84ff690ddf904bc717e174d2c61

    // &with_watch_monetization_types=flatrate&with_watch_providers=8|119|337&watch_region=CA

    const sample_url = `${tmdb_url}/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_watch_monetization_types=flatrate${yearQuery}${genreQuery}${platformQuery}`;

    console.log(sample_url)

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
