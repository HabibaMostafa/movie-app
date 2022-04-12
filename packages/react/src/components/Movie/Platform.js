export function getPlatform(id) {
    let platform;
    switch (id) {
        case 0:
            platform = "Any";
            break;
        case 8:
            platform = "Netflix";
            break;
        case 337:
            platform = "Disney Plus";
            break;
        case 119:
            platform = "Amazon Prime Video";
            break;
        case 230:
            platform = "Crave";
            break;
        case 231:
            platform = "Crave Plus";
            break;
        case 305:
            platform = "Crave Starz";
            break;
        case 3:
            platform = "Google Play Movies";
            break;
        case 2:
            platform = "Apple iTunes";
            break;
        default:
            platform = "Any";
            break;
    }

    return platform;
}


export function getPlatformId(platform) {
    let id;
    switch (platform) {
        case "Any":
            id = 0;
            break;

        case "Netflix":
            id = 8;
            break;

        case "Disney Plus":
            id = 337;
            break;

        case "Amazon Prime Video":
            id = 119;
            break;

        case "Crave":
            id = 230;
            break;

        case "Crave Plus":
            id = 231;
            break;

        case "Crave Starz":
            id = 305;
            break;

        case "Google Play Movies":
            id = 3;
            break;

        case "Apple iTunes":
            id = 2;
            break;
        default:
            id = 0;
            break;
    }
    return id;
}

// { name: "Any", id: 0 },
// { name: "Netflix", id: 8 },
// { name: "Disney Plus", id: 337 },
// { name: "Amazon Prime Video", id: 119 },
// { name: "Crave", id: 230 },
// { name: "Crave Plus", id: 231 },
// { name: "Crave Starz", id: 305 },
// { name: "Google Play Movies", id: 3 },
// { name: "Apple iTunes", id: 2 },
