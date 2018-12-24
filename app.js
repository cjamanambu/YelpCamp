var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var campgrounds = [
  {name: "Salmon Creek", image: "https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f5c27da3ecbcbb_340.jpg"},
  {name: "Granite Hill", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
  {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144590f3c57da6e4b6_340.jpg"},
  {name: "Salmon Creek", image: "https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f5c27da3ecbcbb_340.jpg"},
  {name: "Granite Hill", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
  {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144590f3c57da6e4b6_340.jpg"},
  {name: "Salmon Creek", image: "https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f5c27da3ecbcbb_340.jpg"},
  {name: "Granite Hill", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
  {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144590f3c57da6e4b6_340.jpg"},
  {name: "Salmon Creek", image: "https://pixabay.com/get/e834b70c2cf5083ed1584d05fb1d4e97e07ee3d21cac104491f5c27da3ecbcbb_340.jpg"},
  {name: "Granite Hill", image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg"},
  {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/e136b60d2af51c22d2524518b7444795ea76e5d004b0144590f3c57da6e4b6_340.jpg"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('landing');
});

app.get('/campgrounds', function(req, res){
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image}
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});

app.get('/campgrounds/new', function(req, res){
  res.render('new.ejs');
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`The YelpCamp Server has started on port ${port}`));
