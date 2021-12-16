const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const TourPackage = require("../../models/TourPackage");

router.get('/:theme', async(req, res) => {
    try {
        const package = await TourPackage.find().where({theme: req.params.theme})
        return res.json(package)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fucked Up");
      }
})

router.get('/:min/:max', async(req, res) => {
    try {
        const package = await TourPackage.find().where({ $and: [ {price : { $lte : req.params.max }}, {price : { $gte : req.params.min }} ]})
        return res.json(package)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fucked Up");
      }
})


module.exports = router;
