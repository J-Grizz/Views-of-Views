// Package Variables
var methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  express = require("express"),
  app = express();

//Schema Variables
var User = require("./models/user");

//Route Variables
var campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments"),
  authRoutes = require("./routes/index");

var seedDB = require("./seeds"); //*

// Connect DB
mongoose.connect("mongodb+srv://jgrizz:t!W5U8SMa7-KCg_@viewsofviews-xcrjg.mongodb.net/test?retryWrites=true&w=majority", {
  //mongodb+srv://<username>:<password>@viewsofviews-xcrjg.mongodb.net/test?retryWrites=true&w=majority
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log("connected to DB");
}).catch(err => {
  console.log("ERROR", err.message)
})


//Important Config
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(__dirname + "/public"));
mongoose.set("useFindAndModify", false);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

seedDB();

//Passport Authentication Config
app.use(
  require("express-session")({
    secret: "Once again Po still has the best bum!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Route Config
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server Whisperer
app.listen(process.env.PORT, process.env.IP, () =>
  console.log("Herby, the yelp camp server is now serving.")
);

module.exports = app;
