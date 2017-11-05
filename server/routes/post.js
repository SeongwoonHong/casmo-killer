const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post');

const router = express.Router();

/*
    WRITE POST: POST /api/post
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: EMPTY CONTENTS
*/
router.post('/', (req, res) => {
  // // CHECK LOGIN STATUS
  // if (typeof req.session.loginInfo === 'undefined') {
  //   return res.status(403).json({
  //     error: 'NOT LOGGED IN',
  //     code: 1
  //   });
  // }

  // CHECK CONTENTS VALID
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  // CREATE NEW POST
  const post = new Post({
    writer: req.body.username,
    title: req.body.title,
    contents: req.body.contents
  });

  // SAVE IN DATABASE
  post.save((err) => {
    if (err) throw err;
    return res.json({ success: true });
  });
});

/*
    MODIFY POST: PUT /api/post/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENTS
        3: NOT LOGGED IN
        4: NO RESOURCE
        5: PERMISSION FAILURE
*/
router.put('/:id', (req, res) => {
  // CHECK POST ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 1
    });
  }

  // CHECK CONTENTS VALID
  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  // CHECK LOGIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 3
    });
  }

  // FIND POST
  Post.findById(req.params.id, (err, post) => {
    if (err) throw err;

    // IF POST DOES NOT EXIST
    if (!post) {
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 4
      });
    }

    // // IF EXISTS, CHECK WRITER
    // if (post.writer !== req.session.loginInfo.username) {
    //   return res.status(403).json({
    //     error: 'PERMISSION FAILURE',
    //     code: 5
    //   });
    // }

    // MODIFY AND SAVE IN DATABASE
    post.contents = req.body.contents;
    post.date.edited = new Date();
    post.is_edited = true;

    post.save((error, result) => {
      if (error) throw error;
      return res.json({
        success: true,
        result
      });
    });
  });
});

/*
    DELETE POST: DELETE /api/post/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/
router.delete('/:id', (req, res) => {
  // CHECK POST ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 1
    });
  }

  // CHECK LOGIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 2
    });
  }

  // FIND POST AND CHECK FOR WRITER
  Post.findById(req.params.id, (err, post) => {
    if (err) throw err;

    if (!post) {
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 3
      });
    }
    if (post.writer !== req.session.loginInfo.username) {
      return res.status(403).json({
        error: 'PERMISSION FAILURE',
        code: 4
      });
    }

    // REMOVE THE POST
    Post.remove({ _id: req.params.id }, (error) => {
      if (error) throw error;
      res.json({ success: true });
    });
  });
});

/*
    READ POST: GET /api/post
*/
router.get('/', (req, res) => {
  Post.find()
    .sort({ _id: -1 })
    .limit(6)
    .exec((err, posts) => {
      if (err) throw err;
      res.json(posts);
    });
});

/*
    TOGGLES STAR OF POST: POST /api/post/star/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
*/
router.post('/star/:id', (req, res) => {
  // CHECK POST ID VALIDITY
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 1
    });
  }

  // CHECK LOGIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 2
    });
  }

  // FIND POST
  Post.findById(req.params.id, (err, post) => {
    if (err) throw err;

    // POST DOES NOT EXIST
    if (!post) {
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 3
      });
    }

    // GET INDEX OF USERNAME IN THE ARRAY
    const index = post.starred.indexOf(req.session.loginInfo.username);

    // CHECK WHETHER THE USER ALREADY HAS GIVEN A STAR
    const hasStarred = (index !== -1);

    if (!hasStarred) {
      // IF IT DOES NOT EXIST
      post.starred.push(req.session.loginInfo.username);
    } else {
      // ALREADY starred
      post.starred.splice(index, 1);
    }

    // SAVE THE POST
    post.save((error, result) => {
      if (error) throw error;
      res.json({
        success: true,
        has_starred: !hasStarred,
        result,
      });
    });
  });
});

/*
    READ POST DETAIL: GET /api/post/:id
*/
router.get('/:id', (req, res) => {
  Post.find({ _id: req.params.id })
    .exec((err, post) => {
      if (err) throw err;
      return res.json(post);
    });
});

module.exports = router;
