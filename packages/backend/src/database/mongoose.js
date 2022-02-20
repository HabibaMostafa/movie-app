const mongoose = require("mongoose");

// following along node course, debuggin... ignore this line...
// const databaseName = "task-manager-api";

const databaseName = "CinemaSwipe";
const connectionUrl = `mongodb+srv://master:cis4250@cluster0.5xwl5.mongodb.net/${databaseName}`;
const validator = require("validator");

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
});

