const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const SalonService = require("../../models/SalonService");
const User = require("../../models/User"); 

router.post('/add', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        const salonService = new SalonService ({
            sellerId: req.user.id,
            serviceName: req.body.serviceName,
            serviceCategory: req.body.serviceCategory,
            serviceDescription: req.body.serviceDescription,
            price: req.body.price,
            sellerName: user.name.toLowerCase()
            // Remove tolowerCase() as we have already used it while creating the users
        });
        const newSalonService = await salonService.save();
        return res.json(newSalonService)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fucked Up");
    }
});

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

router.get('/list/:name', async (req,res) => {
    try {
        const tour = await Tour.find({"sellerName":(req.params.name).toLowerCase()})
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