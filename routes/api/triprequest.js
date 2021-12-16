const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const TripRequest = require("../../models/TripRequest");
const User = require("../../models/User");

// Sending request to join trip
router.post("/:id", auth, async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select("-password");
    const user2 = await User.findById(req.params.id).select("username");
    const checkRequest = await TripRequest.find({
      $or: [
        { userReceiveRequest: req.user.id },
        { tripRequestApproved: req.user.id}
      ] 
    });
    if (checkRequest) {
      const sendRequest = new TripRequest({
        user: req.user.id,
        avatar: user.avatar,
        usernameReceivedFrom: user.username,
        usernameSentTo: user2.username,
        userReceiveRequest: req.user.id,
        userSendRequest: req.params.id,
      });
      const request = await sendRequest.save();
      res.json(request);
    } else {
      res.json("Already Requested for this trip");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Fucked Up");
  }
});
router.put("/approve/:id", auth, async(req, res) => {
  try {
    const tripRequest = await TripRequest.findById(req.params.id);
      
    if ((tripRequest.userSendRequest != req.user.id)) {
      const sendRequest = new TripRequest({
        tripRequestApproved: req.user.id,
      });
      const request = await sendRequest.save();
      res.json(request);
    } else {
      res.json("You have already approved this.");
    }
// Create a solution to delete the approved request after deleting the request from either end. 

  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip Request : Not found" });
    }
    else {
    res.status(500).send("Server Fucked Up");
  }
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const request = await TripRequest.findById(req.params.id);

    if (request.userReceiveRequest.toString() == req.user.id) {
      res.json(request);
    } else if (request.userSendRequest.toString() == req.user.id) {
      res.json(request);
    } else {
      res.json({ msg: "User not authorized2" });
    }
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip Request : Not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

router.delete("/delete/sent/:id", auth, async (req, res) => {
  try {
    const request = await TripRequest.findById(req.params.id);

    //check trip request
    if (!request) {
      return res.status(404).json({ msg: "Trip request : Not found" });
    }

    // check user
    if (request.userReceiveRequest.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await request.remove();

    res.json({ msg: "Trip request removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip Request : Not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

router.delete("/delete/received/:id", auth, async (req, res) => {
  try {
    const request = await TripRequest.findById(req.params.id);

    //check trip request
    if (!request) {
      return res.status(404).json({ msg: "Trip request : Not found" });
    }

    // check user
    if (request.userSendRequest.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await request.remove();

    res.json({ msg: "Trip request removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip Request : Not found" });
    }
    res.status(500).send("Server Fucked Up");
  }
});

module.exports = router;