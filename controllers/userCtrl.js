var models = require('../models');
var jwt = require('jwt-simple');
var SHA512 = require("crypto-js/sha512");

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

		models.user.findOne({ where: {login : login, password: SHA512(pwd).toString()} }).then(function(results){
			console.log(results);
			 if (results == null){
				return res.json({status:"failure", message: 'Vous n\'avez pas accès'});
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
	changePwd:function(req,res){
		var currentUser = req.currentUser;
		var user = req.body;
		
		//controle des champs
		if(user.oldpwd ==''|| user.oldpwd==null){
			return res.json({status:"failure", message: 'Le mot de passe actuel n\'est pas renseigné'});
		}

		if(user.newpwd ==''|| user.newpwd==null){
			return res.json({status:"failure", message: 'Le nouveau mot de passe n\'est pas renseigné'});
		}

		if(user.confpwd != user.newpwd){
			return res.json({status:"failure", message: 'La confirmation n\'est pas identique au nouveau mot de passe'});
		}

		models.user.findOne({ where: {password: SHA512(user.oldpwd).toString(), id: currentUser.id } }).then(function(results){
			//console.log(results);
			if (results == null){
				return res.json({status:"failure", message: 'Erreur de mot de passe, vous ne pouvez pas le modifier'});
			} else {
				models.user.update({password: SHA512(user.newpwd).toString()}, {where: {id: currentUser.id  }}).then(user => {
     				return res.json({status:"success", message: "Vous avez modifié votre mot de passe"});
        		})
			}

		}).catch(error =>{
            console.log(error);
            return res.json({status:"failure", message:error.toString()});
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