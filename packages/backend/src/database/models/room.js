const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
    roomName: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    genres: {
        type: Array,
        required: false,
    },
    ratings: {
        type: Array,
        required: false,
    },
    minYear: {
        type: Number,
        required: false,
    },
    maxYear: {
        type: Number,
        required: false,
    },
});

module.exports = Room;
