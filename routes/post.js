const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const  { authDeletePost } = require('../middleware/admin')
const postCtrl = require('../controllers/post')

router.post('/createPost', postCtrl.createPost);
router.get('/', auth,  postCtrl.getPosts);
router.get('/:uuid',auth , postCtrl.getPost);
router.get('/userPosts/:uuid',auth , postCtrl.userPosts);
// router.put('/:uuid',auth , postCtrl.updatePost);
router.delete('/delete/:uuid',auth, /*authDeletePost,*/ postCtrl.delete);

module.exports = router;