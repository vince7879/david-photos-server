var jwt = require('jwt-simple');

module.exports = {

    tokenAuth:function (req,res,next) {
        var token = req.body.david_photos_token || req.query.david_photos || req.get('david-photos-token');
        
        try {
            var currentUser = jwt.decode(token, process.env.passPhrase);
            //console.log(currentUser);
            req.currentUser = currentUser;
            //console.log(req.currentUser.id);
            next();
        }catch(e){
            return res.json({status:'Failure',message:'invalid token'});
        }
    }

};
