const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");

// router.get('/', (req, res) => res.send('Profile Route'));

const Profile = require("../../models/Profile");
const User = require("../../models/User");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no specific profile" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate({
          user: req.user.id,
          $set: profileFields,
          new: true,
        });

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }


    console.log(profileFields);

    res.send("Hello");
  }
);

/*
router.get("/", async (req, res) => {
    try {
      const profiles = await Profile.find().populate("user", [
        "name",
        "avatar",
      ]);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });
  */

  router.get("/user/:user_id", async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", [
        "name",
        "avatar",
        "following",
        "username",
        "bucketlist",
        "roles"
      ])

      if(!profile) return res.status(400).json({msg:'Profile not found'});
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });

  /*router.get("/seller/:seller_id", async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.seller_id }).populate("user", [
        "name",
        "avatar",
      ]).where({"role": "seller"});

      if(!profile) return res.status(400).json({msg:'Profile not found'});
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });
  */
  
  router.delete("/", auth, async (req, res) => {
    try {
    await Profile.findOneAndRemove({user: req.user.id});
    await User.findOneAndRemove({_id: req.user.id});
      res.json({msg: 'User has been Deleted Successfully'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });

router.post('/experience',
 
[
    auth, 
[
check('title', 'Title is required')
    .not()
    .isEmpty(),
check('company', 'Company is required')
    .not()
    .isEmpty(),
check('from', 'From date is required')
    .not()
    .isEmpty()
]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {};

    newExp.user = req.user.id;

    newExp.experience = {};

    if (company) newExp.experience.company = company;
    if (title) newExp.experience.title = title;
    if (location) newExp.experience.location = location;
    if (from) newExp.experience.from = from;
    if (to) newExp.experience.to = to;
    if (current) newExp.experience.current = current;
    if (description) newExp.experience.description = description;


    // const newExp = {
    // title,
    // company,
    // location,
    // from,
    // to,
    // current,
    // description
    // }

try {
    const profile = await Profile.findOneAndUpdate({ 
        user: req.user.id,
        $set: newExp,
        new: true
    });

    await profile.save();
    
    res.json(profile)
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Fucked Up');
    
}

});

router.post('/education', auth, async (req,res)=> {

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body ;

    const newEdu = {};

    newEdu.user = req.user.id;

    newEdu.education = {}

    if (school) newEdu.education.school = school;
    if (degree) newEdu.education.degree = degree;
    if (fieldofstudy) newEdu.education.fieldofstudy = fieldofstudy;
    if (from) newEdu.education.from = from;
    if (to) newEdu.education.to = to;
    if (current) newEdu.education.current = current;
    if (description) newEdu.education.description = description;

    try {

        const profile = await Profile.findOneAndUpdate({
            user: req.user.id,
            $set: newEdu,
            new: true
        });

        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Fucked Up')
        
    }
});

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json({msg: 'Education has been Successfully Deleted from your profile'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });

  router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json({msg: 'Experience has been Successfully Deleted from your profile'});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Fucked Up");
    }
  });


module.exports = router;
