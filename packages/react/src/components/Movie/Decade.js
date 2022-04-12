export function getDecade(id) {
    let decade;
    switch (id) {
        case 0:
            decade = "Any";
            break;
        case 1:
            decade = "1950s";
            break;
        case 2:
            decade = "1960s";
            break;
        case 3:
            decade = "1970s";
            break;
        case 4:
            decade = "1980s";
            break;
        case 5:
            decade = "1990s";
            break;
        case 6:
            decade = "2000s";
            break;
        case 7:
            decade = "2010s";
            break;
        case 8:
            decade = "2020s";
            break;
        default:
            decade = "Any";
            break;
    }
    return decade;
}

export function getDecadeId(decade) {
    let id;
    switch (decade) {
        case "Any":
            id = 0;
            break;
        case "1950s":
            id = 1;
            break;
        case "1960s":
            id = 2;
            break;
        case "1970s":
            id = 3;
            break;
        case "1980s":
            id = 4;
            break;
        case "1990s":
            id = 5;
            break;
        case "2000s":
            id = 6;
            break;
        case "2010s":
            id = 7;
            break;
        case "2020s":
            id = 8;
            break;
        default:
            id = 0;
            break;
    }

    return id;
}
