var express = require('express')
var router = express.Router();
var pictureController = require('../controllers/pictureCtrl');
var auth = require('../middlewares/authMiddleware');
var multer=require('multer');
// var upload=multer({dest:'uploads/'});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

var upload = multer({ storage: storage })

/* Not logged */
router.get('/gallery', pictureController.findByColor);
router.get('/recent', pictureController.findRecent);
router.get('/:id(\\d+)', pictureController.findPictureById);
router.get('/details', pictureController.findIdPictureByColorAndRank);
router.get('/rank', pictureController.getLastRankByColor);

/* Logged */
router.post('/', [auth.tokenAuth, upload.single('uploadFile')], pictureController.sendPicture);
router.get('/all', auth.tokenAuth, pictureController.findAll);
router.get('/edit', auth.tokenAuth, pictureController.findAllByColor);
router.post('/editorder', auth.tokenAuth, pictureController.editOrder);
router.post('/editdetails', auth.tokenAuth, pictureController.editDetails);
router.post('/remove', auth.tokenAuth, pictureController.removePicture);



module.exports = router;