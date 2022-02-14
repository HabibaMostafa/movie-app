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

const connectionUri = `mongodb+srv://${admin}:${password}@cluster0.5xwl5.mongodb.net`;
const databaseName = "CinemaSwipe";

/////extra stuff you can ignore//////////
// example generate a new objectid for a document
// const id = new ObjectId();
// console.log(id);
// all obj ids have a time stamp store in it's first 4 bytes...
// console.log(id.getTimestamp());
// the 12 bytes of an objectid represented as a 24byte hexstring (maybe we store this in the session to see whos logged in?)
// console.log(id.toHexString());
/////extra stuff you can ignore//////////

// const client = new MongoClient(connectionUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// probably need to make async functions...
// client.close(); gets called before the database can even respond, so its commented out

// function search() {
//     // need to await or else connection closes before database responds
//     return new Promise((resolve) => {
//         db.collection("users")
//             .find({ platform: "netflix" })
//             .count((error, count) => {
//                 console.log(
//                     `The number of users with netflix as their platform is ${count}.`
//                 );
//             });
//     });
// }
const client = new MongoClient(connectionUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// function test() {
//     client.connect((error) => {
//         if (error) {
//             return console.log("Unable to connect to database!");
//         }

//         db.collection("users")
//             .find({ platform: "netflix" })
//             .count((error, count) => {
//                 console.log(
//                     `The number of users with netflix as their platform is ${count}.`
//                 );

//                 client.close();
//             });
//     });
// }

client.connect((error) => {
    if (error) {
        return console.log("Unable to connect to database!");
    }

    console.log("connected successfully");

    // specify the name of the DB here
    const db = client.db(databaseName);

    //////////////////////////////////////////////////////////////////// CREATE EXAMPLES////////////////////////////////////////////////////////////

    // NoSQL collections are the same as SQL tables (example inserting a )

    // insert one document
    // db.collection("users").insertOne(
    //     {
    //         name: "testdata",
    //         password: "123",
    //         platform: "netflix"
    //     },
    //     (error, result) => {
    //         if (error) {
    //             console.log(error);
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
            // don't forget to close the connection =)
            client.close();
            console.log("disconnected from mongoDB");
        }
    );

    // find by object id, (you need to create a new objectid obj with the target hex id as an argument)
    // "620a87f2bbc55385f89b8b7c" belongs to the puppetmaster document
    // db.collection("users").findOne(
    //     { _id: new ObjectID("620a87f2bbc55385f89b8b7c") },
    //     (error, user) => {
    //         if (error) {
    //             return console.log("unable to fetch");
    //         }

    //         console.log(user);
    //     }
    // );

    // find multiple documents that match the query, returns a cursor (pointer to the data in the database) instead of a document
    // example query for user docments with netflix listed as their platform (note the create exampels dont add the platform, i did this in Robo 3T )
    // get cursor then convert it to to an array
    // db.collection("users").find({ platform: "netflix" }).toArray((error, users) => {
    //     console.log(users)
    // });

    // similar to above but counts the number of documents that match the query
    // db.collection("users")
    //     .find({ platform: "netflix" })
    //     .count((error, count) => {
    //         console.log(
    //             `The number of users with netflix as their platform is ${count}.`
    //         );
    //     });

    // don't forget to close the connection =)
    // client.close();
    // console.log("disconnected from mongoDB");
});


// test();
