var Campground = require("../models/campground"),
    Comment = require("../models/comments"),
    middleware = require("../middleware"),
    express = require("express"),
    router = express.Router();

//=================
//CAMPGROUND ROUTES
//=================

//Index Route
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user,
                page: "campgrounds"
            });
        }
    });
});

// Create New Campground Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//Show Campground Route
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});


//Campground Post Route
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var rating = req.body.rating;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: image,
        rating: rating,
        description: desc,
        author: author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//Campground Edit Route
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {
                campground: foundCampground
            });
        }
    });
});

//Campground Update Route
router.put("/:id", middleware.checkCampgroundOwnerShip, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, {
        new: true
    }, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Campground Destroy Route
router.delete("/:id", middleware.checkCampgroundOwnerShip, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany({
            _id: {
                $in: campgroundRemoved.comments
            }
        }, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
    });
});

module.exports = router;