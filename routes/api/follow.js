const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

router.put("/f/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Checking if the user has already been liked

    if (
      user.followers.filter(
        (follower) => follower.user.toString() === req.user.id
      ).length > 0
    ) {
      return res.status(400).json({ msg: "User has already been followed" });
    }

    if (req.user.id === req.params.id
      ) {
      return res.status(400).json({ msg: "You can not follow yourself" });
    }

    user.followers.unshift({ user: req.user.id });

    await user.save();
    
    const user2 = await User.findById(req.user.id);
    if (user2.following.filter(
      (following)=>following.user.toString() === req.params.id).length > 0
    ) {
      return res.status(400).json({ msg: "User has already been followed" });
    }
    user2.following.unshift({ user: req.params.id });


    await user2.save();

    res.json(user.followers);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});


router.put("/uf/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Checking if the post has already been liked

    if (
      user.followers.filter((follower) => follower.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "You don't follow this user yet " });
    }

    const removeFollowerIndex = user.followers
      .map((follower) => follower.user.toString())
      .indexOf(req.user.id);

    user.followers.splice(removeFollowerIndex, 1);

    await user.save();

    const user2 = await User.findById(req.user.id);

    if (
      user2.following.filter((following) => following.user.toString() === req.params.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "You don't follow this user yet" });
    }

    const removeFollowingIndex = user2.following
      .map((following) => following.user.toString())
      .indexOf(req.params.id);

    user2.following.splice(removeFollowingIndex, 1);  

    await user2.save();

    res.json({ msg: "unfollowed successfully" });
    res.json(user.followers);


  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

module.exports = router;
