export function getGenre(id) {
    var genre;
    switch(id) {
        case 28:
            genre = "Action";
            break;
        case 12:
            genre = "Adventure";
            break;
        case 16:
            genre = "Animation";
            break;
        case 35:
            genre = "Comedy";
            break;
        case 80:
            genre = "Crime";
            break;
        case 99:
            genre = "Documentary";
            break;
        case 18:
            genre = "Drama";
            break;
        case 10751:
            genre = "Family";
            break;
        case 14:
            genre = "Fantasy";
            break;
        case 36:
            genre = "History";
            break;
        case 27:
            genre = "Horror";
            break;
        case 10402:
            genre = "Music";
            break;
        case 9648:
            genre = "Mystery";
            break;
        case 10749:
            genre = "Romance";
            break;
        case 878:
            genre = "Science Fiction";
            break;
        case 10770:
            genre = "TV Movie";
            break;
        case 53:
            genre = "Thriller";
            break;
        case 10752:
            genre = "War";
            break;
        case 37:
            genre = "Western";
            break;
        default:
            genre = "Unknown";
    }
    return genre;
}

export function getGenreID(genre) {
    var id;
    switch(genre) {
        case "Action":
            id = 28;
            break;
        case "Adventure":
            id = 12;
            break;
        case "Animation":
            id = 16;
            break;
        case "Comedy":
            id = 35;
            break;
        case "Crime":
            id = 80;
            break;
        case "Documentary":
            id = 99;
            break;
        case "Drama":
            id = 18;
            break;
        case "Family":
            id = 10751;
            break;
        case "Fantasy":
            id = 14;
            break;
        case "History":
            id = 36;
            break;
        case "Horror":
            id = 27;
            break;
        case "Music":
            id = 10402;
            break;
        case "Mystery":
            id = 9648;
            break;
        case "Romance":
            id = 10749;
            break;
        case "Science Fiction":
            id = 878;
            break;
        case "TV Movie":
            id = 10770;
            break;
        case "Thriller":
            id = 53;
            break;
        case "War":
            id = 10752;
            break;
        case "Western":
            id = 37;
            break;
    }
    return id;
}