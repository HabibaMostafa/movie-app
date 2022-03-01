const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('password cannot be "password".');
            }
        },
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
});

const Vote = mongoose.model("Vote", {
    movieID: {
        type: Integer,
        required: true,
    },
    user: {
        type: ObjectId,
        required: true,
    },
    liked: {
        type: Boolean,
        required: true,
    }
});

const Match = mongoose.model("Match", {
    movieID: {
        type: Integer,
        required: true,
    },
    user: {
        type: Objectid

    }
});

// module.export = { User, Vote };
