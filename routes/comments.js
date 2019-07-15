var express = require("express"),
    router = express.Router({mergeParams:true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comments"),
    middleware = require("../middleware");

//=====================
//COMMENT ROUTES
//=====================

//Comment Route
router.get("/new", middleware.isLoggedIn, (req, res) => {
   Campground.findById(req.params.id, (err, campground) => {
       if(err){
            console.log(err);
       }else{
            res.render("comments/new", {campground: campground});
       }
   });
});

//Comment Post Route
router.post("/", middleware.isLoggedIn,(req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }else{
           Comment.create(req.body.comment, (err, comment) => {
               if(err){
                   console.log(err);
               }else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
        }
    });
});

//Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip, (req,res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnerShip, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back");
        }else{
            req.flash("Comment deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
