const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

// @route    GET api/profile/me
// @desc     Get current user profile
// @acess    Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile)
      return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @acess    Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is requires')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    // if (company) profileFields.company = company;
    // if (website) profileFields.website = website;
    // if (location) profileFields.location = location;
    // if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    // if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    // profileFields.status = status || '';
    profileFields.githubusername = githubusername || '';
    profileFields.company = company || '';
    profileFields.website = website || '';
    profileFields.location = location || '';
    profileFields.bio = bio || '';

    // Build social object
    profileFields.social = {};
    // if (youtube) profileFields.social.youtube = youtube;
    // if (twitter) profileFields.social.twitter = twitter;
    // if (facebook) profileFields.social.facebook = facebook;
    // if (instagram) profileFields.social.instagram = instagram;
    // if (linkedin) profileFields.social.linkedin = linkedin;

    profileFields.social.youtube = youtube || '';
    profileFields.social.twitter = twitter || '';
    profileFields.social.facebook = facebook || '';
    profileFields.social.instagram = instagram || '';
    profileFields.social.linkedin = linkedin || '';

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create profile if there isn't
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Erorr');
    }
  }
);
// @route    GET api/profile
// @desc     Get all profiles
// @acess    Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @acess    Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found' });
    res.status(500).send('Server Error');
  }
});
// @route    DELETE api/profile/
// @desc     Delte profile, user & posts
// @acess    Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove users posts
    await Post.deleteMany({ user: req.user.id });
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json('User deleted');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    PUT api/profile/experience
// @desc     Add profile experience
// @acess    Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      title,
      company,
      from,
      to,
      location,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      from,
      to,
      location,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    DELETE api/profile/experience/:exp_id
// @desc     Remove experience by id from profile
// @acess    Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { experience: { _id: req.params.exp_id } } },
      { new: true }
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/education
// @desc     Add profile education
// @acess    Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Fieldofstudy is required')
        .not()
        .isEmpty(),
      check('from', 'From is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      location,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      location,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
// @route    DELETE api/profile/education/:edu_id
// @desc     Remove education by id from profile
// @acess    Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { education: { _id: req.params.edu_id } } },
      { new: true }
    );
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @acess    Public
router.get('/github/:username', (req, res) => {
  try {
    const option = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    request(option, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'No Github profile found' });
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
