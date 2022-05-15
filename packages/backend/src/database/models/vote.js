const mongoose = require("mongoose");
const validator = require("validator");

const Vote = mongoose.model("Vote", {
    movieID: {
        type: Number,
        required: true,
    },
    user: {
        // get the object id string
        type: String,
        required: true,
    },
    liked: {
        type: Boolean,
        default: false,
        required: true,
    },
    mustWatch: {
        type: Boolean,
        default: false,
        required: false,
    },
    username: {
        type: String,
        default: "",
        required: false,
    },
    title: {
        type: String,
        default: "",
        required: false,
    },
    poster: {
        type: String,
        default: "",
        required: false,
    },
});

module.exports = Vote;
