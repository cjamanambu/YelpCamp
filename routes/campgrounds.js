var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// index route
router.get('/', function(req, res){
    // get all campgrpunds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// create route
router.post('/', isLoggedIn, function(req, res){
    var name  = req.body.name;
    var image = req.body.image;
    var desc  = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};

    // create a new campground and save to db
    Campground.create(newCampground, function(err, newCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// new route
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// show route
router.get("/:id", function(req, res){
    //find the campground with that campground's id
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
