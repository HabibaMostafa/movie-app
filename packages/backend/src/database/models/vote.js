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
    }
});

module.exports = Vote