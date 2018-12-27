var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require("mongoose"),
    seedDB      = require("./seeds"),
    Campground  = require("./models/campground");


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

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
      res.render("index", {campgrounds: allCampgrounds});
    }
  });
});

// create route
app.post('/campgrounds', function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // create a new campground and save to db
  Campground.create(newCampground, function(err, newCreated){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/campgrounds")
    }
  });
});

// new route
app.get('/campgrounds/new', function(req, res){
  res.render('new.ejs');
});

// show route
app.get("/campgrounds/:id", function(req, res){
  //find the campground with that campground's id
  Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
    if(err){
      console.log(err);
    }
    else{
      console.log(foundCampground);
      res.render("show", {campground: foundCampground});
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`The YelpCamp Server has started on port ${port}`));
