const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const { remove } = require("../../models/Post");

router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);

// For Private Profiles

router.get("/", auth, async (req, res) => {
  try {
    // const posts = await Post.find({user :}).sort({ date: -1 });

     const posts = await Post.aggregate([
       {
         $lookup: {
           from: "users",
           localField: "user",
           foreignField: "following.user",
           as: "following",
         },
       },
        //  {
        //    $group: {
        //      _id : '$user',
        //      text: {$addToSet : '$text'}
        //    }
        //  },


      //  { "$unwind": "$foreignField" }
    ])
    res.json(posts);
    console.log(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Fucked Up");
  }
});

// For public profiles

// router.get('/', async (req,res) => {

//     try {
//         const posts = await Post.find().sort({ date: -1 });
//         res.json(posts);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Fucked Up');
//     }

//     });

// Find post by ID

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

// Find post by ID in Public profile

// router.get('/:id', async (req,res) => {

//     try {
//         const post = await Post.findById(req.params.id);
//         if(!post) {
//             return res.status(404).json({msg: 'Post not found'});
//         }
//         res.json(post);
//     } catch (err) {
//         console.error(err.message);
//         if(err.kind === 'ObjectId') {
//             return res.status(404).json({msg: 'Post not found'});
//         }
//         res.status(500).send('Server Fucked Up');
//     }

//     }
//     );

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check post
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Checking if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post has already been liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Checking if the post has already been liked

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not been liked yet" });
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: "disliked" });
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Get the comment

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // check if comment exists

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check User

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: "Comment removed" });
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Fucked Up");
  }
});
module.exports = router;
