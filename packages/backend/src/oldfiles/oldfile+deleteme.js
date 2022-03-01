const mongoose = require("mongoose");
const databaseName = "task-manager-api";
// const databaseName = "CinemaSwipe";
const connectionUrl = `mongodb+srv://master:cis4250@cluster0.5xwl5.mongodb.net/${databaseName}`;
const validator = require("validator");

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
});

// mongoose will take the model name, convert it to lower case and makes it plural. in the db you'll see "users" instead of "User" below
// define a user model, arguements: String name for model, definition (fields we want)
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
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age cannot be negative.");
            }
        },
    },
});

// a Task object
const Task = mongoose.model("Task", {
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const aTask = new Task({
    description: "shovel driveway",
    completed: true,
});

// attempt to save the new instance to the db
aTask
    .save()
    .then((success) => {
        console.log(aTask);
    })
    .catch((error) => {
        console.log("Error!", error);
    });

const aUser = new User({
    name: "anotherGuest",
    password: "test!yeeee",
    email: "guest@GUESTMAIL.com                    ",
    age: 100,
});

// attempt to save the new instance to the db
aUser
    .save()
    .then((success) => {
        console.log(aUser);
    })
    .catch((error) => {
        console.log("Error!", error);
    });
