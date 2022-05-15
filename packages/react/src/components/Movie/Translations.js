export function getLanguage(iso) {
    var language;
    switch(iso) {
        case "fr":
            language = "French";
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
        case "ru":
            language = "Russian";
            break;
        case "es":
            language = "Spanish";
            break;
        case "tr":
            language = "Turkish";
            break;
        case "ar":
            language = "Arabic";
            break;
        case "en":
            language = "English";
            break;
        case "pa":
            language = "Punjabi";
            break;
        default:
            language = "Other";
    }
    return language;
}

export function getLanguageISO(language) {
    var iso;
    switch(language) {
        case "French":
            iso = "fr";
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
        case "Russian":
            iso = "ru";
            break;
        case "Spanish":
            iso = "es";
            break;
        case "Turkish":
            iso = "tr";
            break;
        case "Arabic":
            iso = "ar";
            break;
        case "English":
            iso = "en";
            break;
        case "Punjabi":
            iso = "pa";
            break;
        default:
            iso = 0;
    }
    return iso;
}