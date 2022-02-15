import MongoDb from './utils/database';
import sha256 from 'sha256'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

const {tmdb} = require("./utils/tmdb");

//3000 port for local, heroku's port depeneds on the server environment variable
const port = process.env.PORT || 8080;
// app.listen(port, () => {
//     console.log(`Server running on port${port}`);
// });

const buildPath = "../react/build";

app.use(express.static(path.join(__dirname, buildPath)));

app.set("port", port);

app.use(cors());

app.get("/", (req, res) => {
    // res.send("hi");
    res.sendFile(path.join(__dirname, buildPath, "index.html"));
});

// -- Login --
app.use("/login", (req, res) => {
    /* TODO: authenticate in database, create unique token */

    // mongodb
    const mongoDb = new MongoDb();
    mongoDb.start(() => {
        console.log("mongoDb ready")
    });

    try {
        let password = req.body.password;
        let username = req.body.username;

        let find_param = {'name':username}

        //find user
        let results = null;
        results = await mongoDb.collection("users").findOne(find_param)

        if (!results) {
            throw Error("no such user found")
        }

        //check password
        if (!results.password){
            throw Error("something must be wrong")
        }

        // let password2 = sha256(password)
        let password2 = crypto.createHash('sha256').update(password).digest('hex');
        let saved_hash = results.password

        results = null
        results = await bcrypt.compare(password2, saved_hash)
        if (results !== true) {
            throw Error("password is not okay")
        }

        //create login token
        let login_token = makeid('4') + parseInt(new Date().getTime()).toString(36);

        let upd_param = {
            '$push':{
                'loginTokens':login_token
            }
        }

        // update mongo
        await mongoDb.collection("users").update(find_param, upd_param)

        res.send({
            token: login_token,
            //token: "test123",
        });

    } catch (err) {
        throw Error(err.message)
    }

    // end mongodb
    mongoDb.end(() => {
        console.log("mongoDb closed")
    });
});


// -- Create a new user --
app.use("/signUp", (req, res) => {
    /* TODO: create in database, create unique token */

    // Start mongodb
    const mongoDb = new mongoDb();
    mongoDb.start(() => {
        console.log("mongoDb ready")
    });

    try {
        // 1. Receive username and password
        let password =  req.body.password;
        let username =  req.body.username;

        let find_param = {'name':username}

        let results = null
        results = await mongoDb.collection("users").count(find_param)
        if (results != 0){
            throw Error("user already exist")
        }

        // bcrypt of password
        // let password2 = sha256(password)
        let password2 = crypto.createHash('sha256').update(password).digest('hex');
        let bcrypt_hash = bcrypt.hashSync(password2, 10);

        // login token which to use login
        let login_token = makeid('4') + parseInt(new Date().getTime()).toString(36);

        let insert_params = {
            createdAt: new Date(),
            password: bcrypt_hash,
            name: username,
            loginTokens: login_token,
        }

        // insert into database
        results = null
        results = await mongoDb.collection("users").insert(insert_params)

        console.log("results: ", results)

        if ( results === null ) {
            throw Error("could not create a user...")
        }

        res.send({
            token: login_token,
        });

    } catch (err) {
        throw Error(err.message)
    }

    // end mongodb
    mongoDb.end(() => {
        console.log("mongoDb closed")
    });
});

// sample api get request
app.use("/movies", (req, res) => {


    // make request to api
    const test = tmdb({},(error, response)=>{

        if(error) {
            console.log("Error! =(")
            return;
        }

        res.send(response);
    });
});


app.get("*", (req, res) => {
    res.send("404, RIP");
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));
