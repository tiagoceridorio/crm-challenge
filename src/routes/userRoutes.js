const UserController = require('../controllers/UserController');
const isAuth = require('../middlewares/isAuth');
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/users', isAuth, UserController.index);
router.get('/users/list', isAuth, UserController.list);
router.post('/users', isAuth, UserController.store);
router.put('/users/:userId', isAuth, UserController.update);
router.get('/users/:userId', isAuth, UserController.show);
router.delete('/users/:userId', isAuth, UserController.remove);
router.post('/users/:userId/media-upload', isAuth, upload.array('profileImage'), UserController.mediaUpload);

module.exports = router;
