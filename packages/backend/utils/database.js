// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// const databaseName = "CinemaSwipe";

// MongoClient.connect(
//     connectionUrl,
//     { useNewUrlParser: true },
//     (error, client) => {
//         if (error) {
//             return console.log("Unable to connect to database!");
//         }

//         console.log("connected correctly");

//         // specify the name of the DB here
//         const db = client.db(databaseName);

//         // NoSQL collections are the same as SQL tables (example inserting a )
//         db.collection('users').insertOne( {
//             name:"puppermaster",
//             password:"123"
//         })
//     }
// );

const { ObjectID } = require("bson");
const { MongoClient, ObjectId } = require("mongodb");

const admin = "master";
const password = "cis4250";

const connectionUrl = `mongodb+srv://${admin}:${password}@cluster0.5xwl5.mongodb.net`;
const databaseName = "CinemaSwipe";

/////extra stuff you can ignore//////////
// example generate a new objectid for a document
const id = new ObjectId();
console.log(id);
// all obj ids have a time stamp store in it's first 4 bytes...
console.log(id.getTimestamp());
// the 12 bytes of an objectid represented as a 24byte hexstring (maybe we store this in the session to see whos logged in?)
console.log(id.toHexString());
/////extra stuff you can ignore//////////

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

        //////////////////////////////////////////////////////////////////// CREATE EXAMPLES////////////////////////////////////////////////////////////

        // NoSQL collections are the same as SQL tables (example inserting a )

        // insert one document
        // db.collection("users").insertOne(
        //     {
        //         name: "puppetmaster",
        //         password: "123",
        //     },
        //     (error, result) => {
        //         if (error) {
        //             return console.log("unable to insert user.");
        //         }
        //     }
        // );

        // inserting multiple documents
        // db.collection("users").insertMany(
        //     [
        //         {
        //             name: "puppetmaster",
        //             password: "123",
        //         },
        //         {
        //             name: "testuser",
        //             password: "12345",
        //         },
        //     ],
        //     (error, result) => {
        //         if (error) {
        //             return console.log("unable to insert users.");
        //         }

        //         console.log(result);
        //     }
        // );

        // db.collection("tasks").insertMany(
        //     [
        //         {
        //             description: "drink coffee",
        //             completed: false,
        //         },
        //         {
        //             description: "mine one bitcoin",
        //             completed: true,
        //         },
        //     ],
        //     (error, result) => {
        //         if (error) {
        //             return console.log("unable to insert users.");
        //         }

        //         console.log(result);
        //     }
        // );

        ////////////////////////////////////////////////////////// READ EXAMPLES //////////////////////////////////////////////////////////

        // read one document, search by username, if record is not found it is not an error, it will just return null instead of the target document
        db.collection("users").findOne(
            { name: "puppetmaster" },
            (error, user) => {
                if (error) {
                    return console.log("unable to fetch");
                }

                console.log(user);
            }
        );

        // find by object id, (you need to create a new objectid obj with the target hex id as an argument)
        // "620a87f2bbc55385f89b8b7c" belongs to the puppetmaster document
        db.collection("users").findOne(
            { _id: new ObjectID("620a87f2bbc55385f89b8b7c") },
            (error, user) => {
                if (error) {
                    return console.log("unable to fetch");
                }

                console.log(user);
            }
        );
    }
);
