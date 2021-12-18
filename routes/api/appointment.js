const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Appointment = require("../../models/Appointment")
const { remove } = require("../../models/Post");

router.post(
  "/",
  [auth, [
      check("serviceName", "Text is required").not().isEmpty()
]],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newAppointment = new Appointment({
        user: req.user.id,
        name: user.username,
        contact: user.phone,
        serviceName: req.body.serviceName,
        appointmentTime: req.body.appointmentTime,
        appointmentDate: req.body.appointmentDate,
        text: req.body.text,
      });

      const appointment = await newAppointment.save();
      res.json(appointment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);

// Get all appointments
router.get('/packages/:id', async (req,res) => {
  try {
      const tour = await Tour.findById(req.params.id)
      if(!tour) {
      return res.json("No Tour Available")
      }
      res.json(tour)
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
  }
})

// Find a appointment by appointmentId
router.get('/packages/:id', async (req,res) => {
  try {
      const tour = await Tour.findById(req.params.id)
      if(!tour) {
      return res.json("No Tour Available")
      }
      res.json(tour)
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
  }
})

module.exports = router;
