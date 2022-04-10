const mongoose = require("mongoose");

const Avatar = mongoose.model("Avatar", {
    userId: {
        type: String,
        required: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
});

module.exports = Avatar;
