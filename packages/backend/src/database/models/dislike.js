const mongoose = require("mongoose");

const Dislike = mongoose.model("Dislike", {
    movieId: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

module.exports = Dislike;
