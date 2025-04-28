const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./model/post");

mongoose.connect("mongodb+srv://ningchingkhei:wvD4sFZii2j9JNEP@cluster0.iho9k7k.mongodb.net/node-angular?retryWrites=true").then(()=>{
    console.log("Connected to database");
})
.catch(()=> {
    console.log("Connection Failed");
})


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("/api/posts", (req,res,next)=> {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        })
    });
})

app.get("/api/posts",(req, res, next)=> {
    Post.find().then(documents => {
        return res.status(200).json({
           message: "Posts fetched Successfully",
           posts: documents
        })
    })
})

app.delete("/api/posts/:id", (req,res, next)=> {
    Post.deleteOne({_id: req.params.id}).then(result => {
        res.status(200).json({
            message: "Deleted successfully"
        })
    })
})

module.exports = app;