var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
const { urlencoded } = require("body-parser");
var methodOverride = require('method-override')

mongoose.connect("mongodb://localhost/blog_app",{ useUnifiedTopology: true ,useNewUrlParser: true });

app.use(express.static("public")); // for css and other thing 
app.use(bodyparser.urlencoded({extended: true}));  //for using content of form 
app.use(methodOverride("_method"));

//model config
var blogschema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    date: {type: Date,default: Date.now},
});

var Blog = mongoose.model("Blog",blogschema);

// Blog.create({
//     title: "compititive programing",
//     image: "https://i.pinimg.com/564x/0c/fc/00/0cfc006cda35279e1d81ace133730cf6.jpg",
//     body: "this is best thing to explore your mind"
// },function(err,data){
//     if(err)
//     console.log("error");
//     else
//     console.log(data);
// });


// restful route
app.get("/",function(req,res){
    res.redirect("/blogs");
});

// index page route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        console.log("something went wrong");
        else{
            res.render("index.ejs",{blogs: blogs});
        }
    });
});

// content adding page
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
})
// posting or adding thing to database
app.post("/blogs",function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var disc = req.body.desc;

    var newblog = {title: title, image : image, description: disc};

    Blog.create(newblog,function(err,newlyblog){
        if(err)
        console.log("error");
        else
        {
            console.log(newlyblog);
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id",function(req,res){
    
    Blog.findById(req.params.id,function(err,obj){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show.ejs",{data : obj});
        }
    });
});

//blog edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,obj){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("edit.ejs",{blog : obj});
        }
    });
});

//blog update
app.put("/blogs/:id",function(req,res){
    var title = req.body.title;
    var image = req.body.image;
    var disc = req.body.desc;

    var newblog = {title: title, image : image, description: disc};

    Blog.findByIdAndUpdate(req.params.id,newblog,function(err,updatedata){
        if(err)
        res.redirect("/");
        else
        res.redirect("/blogs");
    })
    
});

// blog destroy
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/");
        else
        res.redirect("/blogs");
        
    });
});

app.listen(3000,function(){
    console.log("server has been started");
}); 