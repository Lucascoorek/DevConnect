const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route    POST api/posts
// @desc     Create post
// @acess    Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(500).json({ errors: errors.array() });
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });
      await post.save();
      return res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @acess    Private
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    GET api/posts/:id
// @desc     Get post by id
// @acess    Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    return res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
// @route    DELETE api/posts/:id
// @desc     Delete post by id
// @acess    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });
    await post.remove();
    return res.json({ msg: 'Post remved' });
  } catch (error) {
    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
