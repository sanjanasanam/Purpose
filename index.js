//requiring all the installed packages
var express = require("express");
var methodOverride = require("method-override");
var session = require("express-session");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
var flash = require("connect-flash");
app.locals.moment = require("moment");

var passport = require("passport");
var LocalStrategy = require("passport-local");

//requiring all the routes
var blogRoutes = require("./routes/Questions");
var authRoutes = require("./routes/auth");
var commentRoutes = require("./routes/Answers");

//connecting to the database
var url =
  process.env.DATABASEURL ||
  "mongodb+srv://test:test123@purpose.298byca.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.set("view engine", "ejs");

//loading the user model
var User = require("./models/user.js");

//passport configcur
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(flash());
app.use(express.json());
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//using the routes declared
app.use(blogRoutes);
app.use(authRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT || "3000", process.env.ID, function () {
  console.log("The server is running!");
});
