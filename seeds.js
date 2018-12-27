var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    data = [
        {
            name: "Cloud's Rest",
            image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae"
        },
        {
            name: "Desert Mesa",
            image: "https://images.unsplash.com/photo-1506535995048-638aa1b62b77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae"
        },
        {
            name: "Canyon Floor",
            image: "https://images.unsplash.com/photo-1519708495087-ca1b71df408c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae"
        }

    ];

function seedDB(){
    Campground.remove({}, function(err){
       if(err){
           console.log(err);
       }
       console.log("removed campgrounds");
       
       Comment.remove({}, function(err){
           if(err){
               console.log(err);
           }
           console.log("removed comments");
           
           data.forEach(function(seed){
              Campground.create(seed, function(err, campground){
                 if(err){
                     console.log(err);
                 } else {
                     console.log("added a campground");
                     
                     Comment.create(
                         {
                             text: "This place is great but I wish there was internet",
                             author: "Homer"
                         }, function (err, comment) {
                             if(err){
                                 console.log(err);
                             } else {
                                 campground.comments.push(comment);
                                 campground.save();
                                 console.log("Created new comment");
                             }
                         
                     });
                 }
              });
           });
       });
    });
}

module.exports = seedDB;