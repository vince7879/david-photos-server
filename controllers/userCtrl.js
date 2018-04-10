var models = require('../models');
var jwt = require('jwt-simple');
// var SHA512 = require("crypto-js/sha512");

module.exports = {

	login:function(req,res){
		//console.log(process.env.dbHost);
		var login = req.body.login;
		var pwd = req.body.pwd;

		//controle des champs
		if(login=='' || login==null){
			return res.json({status:"failure", message: 'Le login n\'est pas renseigné'});
		}

		if(pwd=='' || pwd==null){
			return res.json({status:"failure", message: 'Vous n\'avez pas saisi de mot de passe'});
		}

		models.user.findOne({ where: {login : login, password: pwd} }).then(function(results){
			console.log(results);
			 if (results == null){
				return res.json({status:"failure", message: 'vous n\'avez pas accès'});
			} else {
				//ici c'ok
				var user ={
					id: results.id,
					login: results.login,
					timestamp: new Date()
				}

				var token = jwt.encode(user, process.env.passPhrase, 'HS512');
				return res.json({status:"success",token: token, id: results.id});
			}
		});


	},
	checkToken: function( req, res){
		console.log('currentUser='+JSON.stringify(req.currentUser));
		var token = req.body.david_photos_token || req.query.david_photos || req.get('david-photos-token');
		// console.log(req.get('david-photos-token'));

		var decoded = jwt.decode(token, process.env.passPhrase);
		console.log('decoded='+JSON.stringify(decoded));
	}

}