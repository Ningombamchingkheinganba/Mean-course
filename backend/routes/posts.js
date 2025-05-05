const express = require("express");
const multer = require("multer");

const Post = require("../model/post");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split('.')[0] // removes the extension
        .replace(/[^a-z0-9]/g, '-'); // replaces spaces and symbols with "-"
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  });

router.post(
    "",
    checkAuth,
     multer({storage: storage}).single("image") ,
     (req,res,next)=> {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath : url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });

    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        })
    });
})

router.put(
    "/:id", 
    checkAuth,
    multer({storage: storage}).single("image"), 
    (req, res, next)=> {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
        if(result.modifiedCount > 0) {
            res.status(200).json({
                message: "Post update successfully",
            })
        } else {
            res.status(400).json({
                message: "Not authorized!",
            })
        }
    });
})

router.get("",(req, res, next)=> {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts;
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize*(currentPage-1))
        .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchPosts = documents;
        return Post.countDocuments();
    })
    .then(count => {
        res.status(200).json({
            message: "Posts fetched Successfully",
            posts: fetchPosts,
            maxPosts: count
         })
    })
})

router.get("/:id",(req, res, next)=> {
    Post.findById(req.params.id).then(post => {
        if(post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post not found"});
        }
    })
})

router.delete(
    "/:id", 
    checkAuth,
    (req,res, next)=> {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if(result.deletedCount > 0) {
            res.status(200).json({
                message: "Post delete successfully",
            })
        } else {
            res.status(400).json({
                message: "Not authorized!",
            })
        }
    })
})

module.exports = router;