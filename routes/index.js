var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Home Route
router.get("/", (req, res) => {
    res.render("landing");
});

//===========
//AUTH ROUTES
//===========

//Show Register From
router.get("/register", (req, res) => {
    res.render("register", {
        page: "register"
    });
});

//Register Post Route
router.post("/register", (req, res) => {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register", {
                error: err.message
            });
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/campgrounds");
        });
    });
});

//Login Show Route
router.get("/login", (req, res) => {
    res.render("login", {
        page: "login"
    });
});

//Login Post Route
router.post("/login", passport.authenticate("local", {
    flashSuccess: "Welcome back",
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {});

//Logout Route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You have successfully logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;