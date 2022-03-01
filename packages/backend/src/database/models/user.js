const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
    name: {
        type: String,
        // required: true,
        default: "Anonymous",
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
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

    // idk if we will have an email but here it is...
    // email: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     lowercase: true,
    //     validate(value) {
    //         if (!validator.isEmail(value)) {
    //             throw new Error("Email is invalid");
    //         }
    //     },
    // },
});

module.exports = User;
