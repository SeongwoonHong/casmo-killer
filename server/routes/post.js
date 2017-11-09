const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/post');

const router = express.Router();

/* GET POST LIST */
router.get('/', (req, res) => {
  Post
    .find({})
    .select({
      content: 0,
      __v: 0,
      updatedAt: 0,
      createdAt: 0
    })
    .limit(100)
    .sort({
      postNum: -1
    })
    .exec((err, posts) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Could not retrieve posts'
        });
      }
      res.json(posts);
    });
});

/* SUBMIT POST */
router.post('/', (req, res) => {
  // AFTER ADD USER
  // const user = req.user;
  // if (!user) {
  //   return res.status(401).json({
  //     message: 'Permission Denied!'
  //   });
  // } else if (!user.isEmailVerified) {
  //   return res.status(401).json({
  //     message: 'Permission Denied! Please verify your email.'
  //   });
  // }
  //
  // console.dir(req.user);

  const { body } = req;
  const { title } = body;
  const { categories } = body;
  const { contents } = body;

  // simulate error if title, categories and content are all "test"
  // This is demo field-validation error upon submission.
  if (title === 'test' && categories === 'test' && contents === 'test') {
    return res.status(403).json({
      message: {
        title: 'Title Error - Cant use "test" in all fields!',
        categories: 'Categories Error',
        content: 'Content Error',
        submitmessage: 'Final Error near the submit button!'
      }
    });
  }

  if (!title || !categories || !contents) {
    return res.status(400).json({
      message: 'Error title, categories and content are all required!'
    });
  }

  const post = new Post({
    title,
    categories: categories.split(','),
    contents,
    authorName: 'gook',
    authorId: 'gook',
    authorImage: 'gook',
    starred: ''
    // AFTER ADD USER
    // authorName: req.user.name,
    // authorUsername: req.user.username,
    // authorId: req.user._id,
    // authorImage: req.user.image
  });


  post.save((err, postResult) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Could not save post'
      });
    }
    res.json(postResult);
  });
});

/* POST DETAIL */
router.get('/:id', (req, res) => {
  Post.findById({
    _id: req.params.id
  }, (err, post) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: 'Could not retrieve post w/ that id'
      });
    }
    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      });
    }
    res.json(post);
  });
});

/* POST DELETE */
router.delete('/:id', (req, res) => {
  // AFTER ADD USER
  // if (!req.user || !req.user.isEmailVerified) {
  //   return res.status(401).json({
  //     message: 'Permission Denied!'
  //   });
  // }

  let { id } = req.params;
  if (id.length !== 24) {
    return res.json({
      message: 'id must be a valid 24 char hex string'
    });
  }
  id = mongoose.Types.ObjectId(req.params.id); // convert to objectid
  Post.findByIdAndRemove(id, (err, post) => {
    if (err) {
      throw err;
    }
    if (!post) {
      return res.status(404).json({
        message: 'Could not delete post'
      });
    }

    res.json({
      result: 'Post was deleted'
    });
  });
});

//
// /*
//     MODIFY POST: PUT /api/post/:id
//     BODY SAMPLE: { contents: "sample "}
//     ERROR CODES
//         1: INVALID ID,
//         2: EMPTY CONTENTS
//         3: NOT LOGGED IN
//         4: NO RESOURCE
//         5: PERMISSION FAILURE
// */
// router.put('/:id', (req, res) => {
//   // CHECK POST ID VALIDITY
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({
//       error: 'INVALID ID',
//       code: 1
//     });
//   }
//
//   // CHECK CONTENTS VALID
//   if (typeof req.body.contents !== 'string') {
//     return res.status(400).json({
//       error: 'EMPTY CONTENTS',
//       code: 2
//     });
//   }
//
//   if (req.body.contents === '') {
//     return res.status(400).json({
//       error: 'EMPTY CONTENTS',
//       code: 2
//     });
//   }
//
//   // CHECK LOGIN STATUS
//   if (typeof req.session.loginInfo === 'undefined') {
//     return res.status(403).json({
//       error: 'NOT LOGGED IN',
//       code: 3
//     });
//   }
//
//   // FIND POST
//   Post.findById(req.params.id, (err, post) => {
//     if (err) throw err;
//
//     // IF POST DOES NOT EXIST
//     if (!post) {
//       return res.status(404).json({
//         error: 'NO RESOURCE',
//         code: 4
//       });
//     }
//
//     // // IF EXISTS, CHECK WRITER
//     // if (post.writer !== req.session.loginInfo.username) {
//     //   return res.status(403).json({
//     //     error: 'PERMISSION FAILURE',
//     //     code: 5
//     //   });
//     // }
//
//     // MODIFY AND SAVE IN DATABASE
//     post.contents = req.body.contents;
//     post.date.edited = new Date();
//     post.is_edited = true;
//
//     post.save((error, result) => {
//       if (error) throw error;
//       return res.json({
//         success: true,
//         result
//       });
//     });
//   });
// });
//
// /*
//     TOGGLES STAR OF POST: POST /api/post/star/:id
//     ERROR CODES
//         1: INVALID ID
//         2: NOT LOGGED IN
//         3: NO RESOURCE
// */
// router.post('/star/:id', (req, res) => {
//   // CHECK POST ID VALIDITY
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({
//       error: 'INVALID ID',
//       code: 1
//     });
//   }
//
//   // CHECK LOGIN STATUS
//   if (typeof req.session.loginInfo === 'undefined') {
//     return res.status(403).json({
//       error: 'NOT LOGGED IN',
//       code: 2
//     });
//   }
//
//   // FIND POST
//   Post.findById(req.params.id, (err, post) => {
//     if (err) throw err;
//
//     // POST DOES NOT EXIST
//     if (!post) {
//       return res.status(404).json({
//         error: 'NO RESOURCE',
//         code: 3
//       });
//     }
//
//     // GET INDEX OF USERNAME IN THE ARRAY
//     const index = post.starred.indexOf(req.session.loginInfo.username);
//
//     // CHECK WHETHER THE USER ALREADY HAS GIVEN A STAR
//     const hasStarred = (index !== -1);
//
//     if (!hasStarred) {
//       // IF IT DOES NOT EXIST
//       post.starred.push(req.session.loginInfo.username);
//     } else {
//       // ALREADY starred
//       post.starred.splice(index, 1);
//     }
//
//     // SAVE THE POST
//     post.save((error, result) => {
//       if (error) throw error;
//       res.json({
//         success: true,
//         has_starred: !hasStarred,
//         result,
//       });
//     });
//   });
// });


module.exports = router;
