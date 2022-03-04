const mongoose = require("mongoose");

const Match = mongoose.model("Match", {
    user1Id: {
        type: String,
        required: true,
    },
    user1Vote: {
        type: String,
        required: true,
    },
    user2Id: {
        type: String,
        required: true,
    },
    user2Vote: {
        type: String,
        required: true,
    },
    movieID: {
        type: Number,
        required: true,
    }
});
