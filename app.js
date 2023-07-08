const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const path = require("node:path");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.set("view engine", "ejs");

app.set("trust proxy", 1); // trust first proxy
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
    })
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = 3000 || process.env.PORT;
const saltRounds = 10;
// const mongodb_URI = process.env.MONGODB_URI;

const local_URI = "mongodb://127.0.0.1:27017/userDB";

mongoose.connect(local_URI, {
    useNewUrlParser: true,
});

const userSchema = mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
});
//mongoose-encryption
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET,
//     encryptedFields: ["password"],
// });

//passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture,
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/secrets",
            // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
            // userProfileURL: "https://www.googleapis.com/auth/profile.emails.read",
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    )
);

app.get("/", function (req, res) {
    res.render("home");
});

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get(
    "/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        // Successful authentication, redirect to secrets.
        res.redirect("/secrets");
    }
);

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", async function (req, res) {
    // if (req.isAuthenticated()) {
    //     res.render("secrets");
    // } else {
    //     res.redirect("/login");
    // }
    try {
        const users = await User.find({ "secret": { $ne: null } });
        if (users) {
            res.render("secrets", { usersWithSecrets: users });
        } else {
            console.log("No users found with secret");
        }
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.post("/register", function (req, res) {
    try {
        User.register(
            new User({ username: req.body.username }),
            req.body.password,
            function (err, account) {
                if (err) {
                    res.send("User already exist");
                }

                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets");
                });
            }
        );
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.post("/login", function (req, res) {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });
        req.login(user, function (err) {
            if (err) {
                return res.render(err);
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", async function (req, res) {
    try {
        const secret = req.body.secret;
        const user = await User.findOne({ _id: req.user.id });

        user.secret = secret;
        user.save();
        res.redirect("/secrets");
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});

// try {
//     const { username, password } = req.body;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//         // Store hash in your password DB.
//         const user = new User({
//             email: username,
//             // password: password,
//             // password: md5(password),
//             password: hash,
//         });
//         user.save();
//     });
//     res.redirect("/login");
// } catch (error) {
//     res.status(500).json({ Error: error.message });
// }

// app.post("/login", async function (req, res) {
//     // try {
//     //     const { username, password } = req.body;
//     //     const user = await User.findOne({ email: username }).exec();
//     //     if (user) {
//     //         bcrypt.compare(password, user.password, function (err, result) {
//     //             // result == true
//     //             if (result) {
//     //                 res.render("secrets");
//     //             } else {
//     //                 res.send("Please enter correct password!");
//     //             }
//     //         });
//     //         // if (user.password === md5(password)) {
//     //         //     res.render("secrets");
//     //         // } else {
//     //         //     res.send("Please enter correct password!");
//     //         // }
//     //     } else {
//     //         res.send("User Not Found! Please register user");
//     //     }
//     // } catch (error) {
//     //     res.status(500).json({ Error: error.message });
//     // }

// });
