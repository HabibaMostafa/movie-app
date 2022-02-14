// const admin = "master";
// const password = "cis4250";

// const { MongoClient } = require('mongodb');
// const uri = `mongodb+srv://${admin}:${password}@cluster0.5xwl5.mongodb.net/CinemaSwipe?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// const connectionUrl ="mongodb+srv://master:cis4250@cluster0.5xwl5.mongodb.net/task-manager?retryWrites=true&w=majority"
const connectionUrl = "mongodb+srv://master:cis4250@cluster0.5xwl5.mongodb.net";

const databaseName = "CinemaSwipe";

MongoClient.connect(
    connectionUrl,
    { useNewUrlParser: true },
    (error, client) => {
        if (error) {
            return console.log("Unable to connect to database!");
        }

        console.log("connected correctly");

        // specify the name of the DB here
        const db = client.db(databaseName);

        // NoSQL collections are the same as SQL tables (example inserting a )
        db.collection('users').insertOne( {
            name:"puppermaster",
            password:"123"
        })
    }
);

