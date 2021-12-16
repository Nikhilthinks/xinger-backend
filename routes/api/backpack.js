const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Backpack = require("../../models/Backpack");
const TourPackage = require("../../models/TourPackage");
const User = require("../../models/User");

router.post('/:tourid', auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        const tourPackage = await TourPackage.findById(req.params.tourid)
        const backpack = new Backpack({
            userId: req.user.id,
            packageId: req.params.tourid,
            username: user.username,
            user_name: user.name,
            contact: user.phone,
            tripDate: req.body.tripDate,
            packageName: tourPackage.productName
        })
        backpack.save()
        return res.json(backpack)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fucked Up");
      }
})

router.put('/:tourid', auth, async(req,res) => {
  const tourPackage = await TourPackage.findById(req.params.tourid)
  tourPackage.bookings = tourPackage.bookings + 1
  await tourPackage.save()
  return res.json(tourPackage)
})

router.get('/:tourid', async(req, res) => {
  try {
      const package = await TourPackage.find()
      return res.json(package)
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
})

router.get('/:tourid', async(req, res) => {
  try {
      const package = await TourPackage.find()
      return res.json(package)
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
})

module.exports = router;
