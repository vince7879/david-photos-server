var express = require('express')
var router = express.Router();
var userController = require('../controllers/userCtrl');
var auth = require('../middlewares/authMiddleware');

/* Not logged */
router.post('/login', userController.login);

/* Logged */
router.get('/checkToken', auth.tokenAuth, userController.checkToken);
router.post('/changePwd', auth.tokenAuth, userController.changePwd);


module.exports = router;