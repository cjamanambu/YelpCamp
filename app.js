var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Campground  = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
seedDB();

/// Passport Config
app.use(require("express-session")({
  secret: "Validator",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res){
  res.render('landing');
});

// index route
app.get('/campgrounds', function(req, res){
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
app.post('/campgrounds', function(req, res){
  var name  = req.body.name;
  var image = req.body.image;
  var desc  = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
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
app.get('/campgrounds/new', function(req, res){
  res.render('campgrounds/new');
});

// show route
app.get("/campgrounds/:id", function(req, res){
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

///////////////////////////////////////////////////////////////////////////////////////////////////
// COMMENT ROUTES /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// new route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {campground: campground});
    }
  });
});

// create route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    }
    else{
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        }else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH ROUTES /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/register", function(req, res){
  res.render("register");
});
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if(err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

app.get("/login", function(req, res){
  res.render("login");
});
app.post("/login", passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`The YelpCamp Server has started on port ${port}`));
