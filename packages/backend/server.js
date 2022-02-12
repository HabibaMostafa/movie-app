const express = require("express");
const cors = require("cors");
const app = express();

//3000 port for local, heroku's port depeneds on the server environment variable
const port = process.env.PORT || 8080;
// app.listen(port, () => {
//     console.log(`Server running on port${port}`);
// });

app.use(cors());

app.use("/login", (req, res) => {
    /* TODO: authenticate in database, create unique token */

    res.send({
        token: "test123",
    });
});

app.use("/createUser", (req, res) => {
    /* TODO: create in database, create unique token */

    res.send({
        token: "test123",
    });
});

app.listen(port, () =>
    console.log(`API is running on http://localhost:${port}/login`)
);
