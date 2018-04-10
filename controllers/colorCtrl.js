var models = require('../models');

module.exports = {

	findAll: function (req, res) {
		// console.log(req);
  //   	console.log(res);
    	models.color.findAll().then(colors => {
    		// console.log(colors);
            return res.json(colors);
        })
    },
    findAllExceptCurrent: function (req, res) {
    	// console.log(req.query.color);
    	var currentColor = req.query.color;
    	models.color.findAll({ where: { name: {$ne: currentColor} } }).then(colors => {
    		// console.log(colors);
            return res.json(colors);
        })
    },
    findHexacodeColor: function (req, res) {
        console.log(req.query.color);
        var currentColor = req.query.color;
        models.color.findOne({ where: { name: currentColor } }).then(colors => {
            // console.log(colors);
            return res.json(colors);
        })
    }

}