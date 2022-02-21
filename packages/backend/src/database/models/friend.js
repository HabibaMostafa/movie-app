const mongoose = require("mongoose");
const validator = require("validator");

// user1 is the requestor, user2 is the accepter
// status can be pending or accepted
// if user2 declines, this record will just be deleted.
const Friend = mongoose.model("Friend", {
    user1: {
        type: String,
        required: true,
    },
    user2: {
        type: String,
        required: true,
    },
    status: {
        type:String,
        required: true
    }
});

module.exports = Friend
