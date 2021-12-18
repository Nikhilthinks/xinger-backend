const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Order = require("../../models/Order");
const TourPackage = require("../../models/TourPackage");
const User = require("../../models/User");
const {validationResult } = require("express-validator/check");
const razorpayInstance = require("../../config/rzp")

router.get('/', async(req, res) => {
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
        const package = await TourPackage.findById(req.params.tourid)
        return res.json(package)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Fucked Up");
      }
})


// might get redundant someday
router.put('/:tourid', auth, async(req,res) => {
    const tourPackage = await TourPackage.findById(req.params.tourid)
    tourPackage.visited = tourPackage.visited + 1
    await tourPackage.save()
    return res.json(tourPackage)
  })  

router.post('/:tourid/buy', auth, async(req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tourPackage = await TourPackage.findById(req.params.tourid);
        const user = await User.findById(req.user.id);
        const order = new Order({
            amount: tourPackage.price,
            packageId: req.params.tourid,
            sellerId: tourPackage.sellerId,
            sellerName: tourPackage.sellerName,
            buyerId: req.user.id,
            username: req.user.username,
        })

        amount = tourPackage.price;
        const currency = 'INR';


        razorpayInstance.orders.create({amount, currency}, 
          async (err, rzpOrder)=>{
            
            if(!err) {
              order.rzpObject = rzpOrder;
              tourPackage.purchased = true;
              tourPackage.bookings = tourPackage.bookings + 1;
              await order.save()
              await tourPackage.save();
              console.log('tourPackage: ',tourPackage);
              return res.json(order)
            } else {
              res.send(err);

            }
          }
      )

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });

module.exports = router;
