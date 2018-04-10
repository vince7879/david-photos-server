var express = require('express')
var router = express.Router();
var colorController = require('../controllers/colorCtrl');
// var auth = require('../middlewares/authMiddleware');

/* Not logged */
router.get('/', colorController.findAll);
router.get('/menu', colorController.findAllExceptCurrent);
router.get('/hexacode', colorController.findHexacodeColor);

/* Logged */


module.exports = router;