const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// const { canDeleteUser } = require('../middleware/admin')
const userCtrl = require('../controllers/user')

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/getUsers',auth , userCtrl.getUsers);
router.get('/getUser/:uuid',auth , userCtrl.getUser);
router.put('/update/:uuid',auth, userCtrl.updateUser);
router.delete('/deleteUser/:uuid', auth, /*authDeleteUser*/ userCtrl.deleteUser);

module.exports = router;