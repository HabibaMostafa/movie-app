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
        case "iso":
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
            iso = "et";
            break;
        case "French":
            iso = "fr";
            break;
        case "Irish":
            iso = "ga";
            break;
        case "Croatian":
            iso = "hr";
            break;
        case "Hungarian":
            iso = "hu";
            break;
        case "Indonesian":
            iso = "id";
            break;
        case "Italian":
            iso = "it";
            break;
        case "Japanese":
            iso = "ja";
            break;
        case "Korean":
            iso = "ko";
            break;
        case "Latin":
            iso = "la";
            break;
        case "Dutch":
            iso = "nl";
            break;
        case "Portuguese":
            iso = "pt";
            break;
        case "Russian":
            iso = "ru";
            break;
        case "Spanish":
            iso = "es";
            break;
        case "Swedish":
            iso = "sv";
            break;
        case "Turkish":
            iso = "tr";
            break;
        case "Arabic":
            iso = "ar";
            break;
        case "Persian":
            iso = "fa";
            break;
        case "English":
            iso = "en";
            break;
        case "Punjabi":
            iso = "pa";
            break;
    }
    return iso;
}