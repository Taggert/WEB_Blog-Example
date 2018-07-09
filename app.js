const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const router = require("./roots/posts");
const keys = require("./keys");


mongoose.connect(keys.mongoURI)
    .then(()=>console.log("MongoDB connected"))
    .catch((error)=>console.err(error));

const port = 8081;
const clientPath = path.join(__dirname, "client")


const app = express();
app.use(bodyParser.json());
app.use(express.static(clientPath));
app.use("/api/post", router);

app.listen(port, () => {
    console.log(`Server has been started on port ${port}`);
});

