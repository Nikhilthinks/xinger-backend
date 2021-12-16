const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const SellerInfo = require("../../models/SellerInfo");
const SellerAc = require("../../models/SellerAc");
const Seller = require("../../models/Seller");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Enter a password with 6 or more characters").isLength({
      min: 6,
    }),
    check("username", "Use a unique username for your business.").not().isEmpty(),
    check("companyName", "Select a Company Name"),
    check("addressL1", "Enter address"),
    check("country", "Select country"),
    check("state", "Select state"),
    check("pinCode", "Enter pincode"),
    check("phone", "Enter Contact Number"),

    //Add account type option
  ],
  async (req, res) => {
     console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      //remove all jsons while uploading to prevent security breaches
    }
    const { name, username, password, email, state , pinCode, companyName, addressL1, country, phone} = req.body;

    try {
      let user = await Seller.findOne({ email, username });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new Seller({
        name,
        username: username.toLowerCase(),
        phone,
        avatar,
        password,
        //seller extra details
        email: email.toLowerCase(),    
        companyName,
        addressL1,
        country,
        state,
        pinCode,
      });


      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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

    //   let sellerInfo = new SellerInfo({
    //     email: email.toLowerCase(),    
    //     companyName,
    //     addressL1,
    //     addressL2,
    //     country,
    //     state,
    //     pinCode,
    //     taxNumber: taxNumber.toLowerCase()
    // })

    // let sellerAccountInfo = new SellerAc({
    //     email: email.toLowerCase(),
    //     accountNo,
    //     bank,
    //     ifsc,
    //     AcName,
    // })

    await user.save();
    // await sellerAccountInfo.save()

    console.log('seller', user);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  }
);


module.exports = router;
