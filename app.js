const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.set("view engine", "ejs");

const PORT = 3000 || process.env.PORT;

// const mongodb_URI = process.env.MONGODB_URI;

const local_URI = "mongodb://127.0.0.1:27017/userDB";

mongoose.connect(local_URI, {
    useNewUrlParser: true,
});

const userSchema = mongoose.Schema({
    email: String,
    password: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", async function (req, res) {
    try {
        const { username, password } = req.body;
        const user = new User({
            email: username,
            password: password,
        });
        user.save();

        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.post("/login", async function (req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username }).exec();

        if (user) {
            if (user.password === password) {
                res.render("secrets");
            } else {
                res.send("Please enter correct password!");
            }
        } else {
            res.send("User Not Found! Please register user");
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
