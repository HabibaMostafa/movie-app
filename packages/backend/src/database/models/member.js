const mongoose = require("mongoose");

const Member = mongoose.model("Member", {
    userId: {
        type: String,
        required: true,
    },
    roomId: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
    chosenMovie: {
        type: Number,
        required: false,
    },
});

module.exports = Member;
