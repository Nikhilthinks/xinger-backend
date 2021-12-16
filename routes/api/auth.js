const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator/check");


router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Fucked Up");
  }
});

router.post(
  "/",
  [
    // check("email", "Please enter your email").isEmail(),
    check("username", "Please enter your username").exists(),
    check("password", "Password required").exists()
    
  ],
  async (req, res) => {
    // console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      } else {
        // res.json({'user Details' : {user}});
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
              throw err;
            } else {
              res.json({'token' : { token }});
            }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);

router.post(
  "/seller",
  [
    // check("email", "Please enter your email").isEmail(),
    check("username", "Please enter your username").exists(),
    check("password", "Password required").exists()
    
  ],
  async (req, res) => {
    // console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;

    try {
      let user = await Seller.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      res.json({user});

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);

module.exports = router;
