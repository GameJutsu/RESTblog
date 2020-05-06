var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    expressSanitizer= require("express-sanitizer");
    
mongoose.connect('mongodb://localhost/rest_blog', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSanitizer());

app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema
(
    {
        title: String,
        image: String,
        body: String,
        created: {type: Date, default: Date.now}
    }
);

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create
// (
//     {
//         title: "First Blog",
//         image: "https://cdn.pixabay.com/photo/2015/05/11/14/44/pencils-762555__340.jpg",
//         body: "Holy shit this is my first blog."
//     },
//     function(err, newBlog)
//     {
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             console.log(newBlog);
//         }
//     }
// );

//Homepage redirection
app.get("/", function(req, res)
{
   res.redirect("/blogs"); 
});

//Index route
app.get("/blogs", function(req, res)
{
    Blog.find({}, function(err, blogs)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("index", {blogs: blogs});
        }
    });
});

//New route
app.get("/blogs/new", function(req, res)
{
    res.render("new");
});

//Create route
app.post("/blogs", function(req, res)
{
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.create
    (
        req.body.blog,
        function(err, newlyCreated)
        {
            if(err)
            {
                res.redirect("/blogs/new");
            }
            else
            {
                res.redirect("/blogs");
            }
        }
    );
});

//Show route
app.get("/blogs/:id", function(req, res)
{
    Blog.findById(req.params.id, function(err, foundBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("show",{blog: foundBlog});
        }
    });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res)
{
    Blog.findById(req.params.id, function(err, foundBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit",{blog: foundBlog});
        }
    });
});

//Update route
app.put("/blogs/:id", function(req, res)
{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete route
app.delete("/blogs/:id", function(req, res)
{
    Blog.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    });
});

// app.listen(process.env.PORT, process.env.IP, function()
app.listen(8080, "0.0.0.0", function()
    {
        console.log("Blog App server running");
    });