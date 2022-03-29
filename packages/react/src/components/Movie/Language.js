export function getLanguage(iso) {
    var language;
    switch(iso) {
        case "et":
            language = "Estonian";
            break;
        case "fr":
            language = "French";
            break;
        case "ga":
            language = "Irish";
            break;
        case "hr":
            language = "Croatian";
            break;
        case "hu":
            language = "Hungarian";
            break;
        case "genre":
            language = "Indonesian";
            break;
        case "it":
            language = "Italian";
            break;
        case "ja":
            language = "Japanese";
            break;
        case "ko":
            language = "Korean";
            break;
        case "la":
            language = "Latin";
            break;
        case "nl":
            language = "Dutch";
            break;
        case "pt":
            language = "Portuguese";
            break;
        case "ru":
            language = "Russian";
            break;
        case "es":
            language = "Spanish";
            break;
        case "sv":
            language = "Swedish";
            break;
        case "tr":
            language = "Turkish";
            break;
        case "ar":
            language = "Arabic";
            break;
        case "fa":
            language = "Persian";
            break;
        case "en":
            language = "English";
            break;
        case "pa":
            language = "Punjabi";
            break;
        default:
            language = "Unknown";
    }
    return language;
}

export function getlanguageISO(language) {
    var iso;
    switch(language) {
        case "Estonian":
            genre = "et";
            break;
        case "French":
            genre = "fr";
            break;
        case "Irish":
            genre = "ga";
            break;
        case "Croatian":
            genre = "hr";
            break;
        case "Hungarian":
            genre = "hu";
            break;
        case "Indonesian":
            genre = "id";
            break;
        case "Italian":
            genre = "it";
            break;
        case "Japanese":
            genre = "ja";
            break;
        case "Korean":
            genre = "ko";
            break;
        case "Latin":
            genre = "la";
            break;
        case "Dutch":
            genre = "nl";
            break;
        case "Portuguese":
            genre = "pt";
            break;
        case "Russian":
            genre = "ru";
            break;
        case "Spanish":
            genre = "es";
            break;
        case "Swedish":
            genre = "sv";
            break;
        case "Turkish":
            genre = "tr";
            break;
        case "Arabic":
            genre = "ar";
            break;
        case "Persian":
            genre = "fa";
            break;
        case "English":
            genre = "en";
            break;
        case "Punjabi":
            genre = "pa";
            break;
    }
    return genre;
}