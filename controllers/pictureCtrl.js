var models = require('../models');
var sizeOf = require('image-size');

module.exports = {

	findAll: function (req, res) {
        // console.log(req);
  //    console.log(res);
  models.photo.findAll().then(pictures => {
            // console.log(pictures);
            return res.json(pictures);
        })
},
sendPicture: function (req, res) {

    var filename = req.file.filename;
    var thumbname = filename.slice(0, -4) + '_thumb.jpg'
    var pic_size = req.file.size;
    var pic_name = req.file.originalname;
    var place = req.body.place;
    var year = req.body.year;
    var month = req.body.month;
    var color = req.body.color;

    //Controle des champs
    var regexPlace = RegExp(/^([a-zéèàùïôæœ-]+\s?)*\s*$/i);
    
    if( !isNaN(place) || place=='undefined' || !regexPlace.test(place) || place.length < 2 || place.length > 60) {
        return res.json({status:"failure", message: 'Erreur sur le champ Lieu'});
    } 

    var today = new Date();

    if( isNaN(year) || year=='undefined' || year.length != 4 || year > today.getFullYear() || year < 1900 ) {
        return res.json({status:"failure", message: 'Erreur sur le champ Année'});
    }

    // TODO tester ici req.file.originalname pour voir si la phot a dea ete postée
        
        models.photo.max('rank', { where: { color_name: color }}).then(function(rank) {
          // console.log(rank);
          if (rank >= 32) {
            return res.json({status:"failure", message: 'Vous ne pouvez pas ajouter cette photo à cette galerie car elle est complète.'});
        }
          else {
            let next;
            if (isNaN(rank)) {
                next = 1;
            } else {
                next = rank+1;
            }
                // res.json({status:"success", message: 'Il y a déjà '+rank+' photos de la couleur '+color+', vous ajoutez donc la '+next+'è photo de cette couleur'});

                //orientation
                var dimensions = sizeOf(__dirname + '/../uploads/' + filename);
                // console.log(dimensions.width, dimensions.height);
                var orientation = '';
                var w = '';
                dimensions.width > dimensions.height ? orientation = 'landscape' : orientation = 'portrait';
                dimensions.width > dimensions.height ? w = 400 : w = 300;


                //thumbnails creation
                var thumb = require('node-thumbnail').thumb;

                thumb({
                  source: __dirname + '/../uploads/' + filename, // could be a filename: dest/path/image.jpg 
                  destination: __dirname + '/../uploads/',
                  // concurrency: 4,
                  width: w
              }, function(files, err, stdout, stderr) {
                  console.log('All done!');
              });

                models.photo.create({file_name: filename, thumb_name: thumbname, place: place, year: year, month: month, name: pic_name, size: pic_size, orientation: orientation, color_name: color, rank: next}).then(result=>{
                    return res.json({status:"success", message: "Vous avez ajouté la photo " + pic_name + " à la galerie "+color});    
                }).catch(error =>{
                    console.log(error);
                    return res.json({status:"failure", message:error.toString()});
                });
            }
        })

},
findAllByColor: function (req, res) {
    var currentColor = req.query.color;

    models.photo.findAll({where: { color_name: currentColor }, order:'rank ASC'}).then(pictures => {
            // console.log(pictures);
            return res.json(pictures);
        })
},
findByColor: function (req, res) {
    var currentColor = req.query.color;
    var currentPage = req.query.page;
    var offset = (currentPage * 16) - 16

    models.photo.findAndCountAll({ where: { color_name: currentColor }, order:'rank ASC', offset: offset, limit: 16 }).then(pictures => {
        return res.json(pictures);
    })
},
findPictureById: function (req, res) {
    models.photo.findById(req.params.id).then(data => {
        return res.json({status:"success", data:data});
    }).catch(error =>{
        return res.json({status:"failure", message:error.toString()});
    });
},
findIdPictureByColorAndRank: function (req, res) {
    var currentColor = req.query.color;
    var currentRank = req.query.rank;
    models.photo.findOne({ where: {color_name: currentColor, rank: currentRank} }).then(picture => {
        console.log(picture.id);
        return res.json({status:"success", data:picture});
    }).catch(error =>{
        return res.json({status:"failure", message:error.toString()});
    });
},
findRecent: function (req, res) {
    models.photo.findAll({order:'createdAt DESC', limit: 16 }).then(data => {
        return res.json({status:"success", data:data});
    }).catch(error =>{
        return res.json({status:"failure", message:error.toString()});
    });
},
editOrder:function(req,res){
        // console.log(req.body.pix.length);
        var picture_collection = req.body.pix;
        for (let i = 0; i < picture_collection.length; i++) {
            let newRank = i + 1;
            models.photo.update({rank: newRank}, {where: {id: picture_collection[i].id  }}).then(result => {
                // console.log(i);
                if (i == picture_collection.length - 1) {
                    return res.json({status:"success", message: "ordre des img modifié en base"});
                }
            }).catch(error =>{
                console.log(error);
                return res.json({status:"failure", message:error.toString()});
            });
        }
    },
    editDetails:function(req,res){
        console.log(req.body);
        var unikId = req.body.id;
        var newPlace = req.body.place;
        var newYear = req.body.year;
        var newMonth = req.body.month;
        var newColor = req.body.newColor;
        var oldColor = req.body.oldColor;
        
        models.photo.findOne({where: { id: unikId, color_name: oldColor }}).then(pic => {
            if ((pic.place == newPlace) && (pic.year == newYear) && (pic.month == newMonth) && (oldColor == newColor)) {
                return res.json({status:"nochange", message: "Vous n'avez effectué aucun changement sur la photo "+ pic.name});
            } 
            else {
                if (oldColor != newColor) {
                    return countPicturesByColor(newColor).then(result=>{
                        console.log(result);
                        if (result >= 32) {
                            return res.json({status:"failure", message:"La galerie "+newColor+" est complète, vous ne pouvez pas y ajouter de photo"});
                        } else {
                            return models.photo.update({place: newPlace, year: newYear, month: newMonth, color_name: newColor}, {where: {id: unikId  }}).then(result => {
                                return getPicturesByColor(oldColor)
                            }).then(oldPictures => {
                                for (let i = 0; i < oldPictures.length; i++) {
                                    let newRank = i + 1;
                                    models.photo.update({rank: newRank}, {where: {id: oldPictures[i].id  }})
                                }
                                return getPicturesByColor(newColor)
                            }).then(newPictures => {
                                for (let i = 0; i < newPictures.length; i++) {
                                    let newRank = i + 1;
                                    models.photo.update({rank: newRank}, {where: {id: newPictures[i].id  }})
                                }
                                return res.json({status:"success", message: "new ranking ok sur "+oldColor+" et "+newColor});
                            }).catch(error =>{
                                return res.json({status:"failure", message:error.toString()});
                            });
                        }
                    }).catch(error =>{
                        return res.json({status:"failure", message:error.toString()});
                    });
                } else {
                    return models.photo.update({place: newPlace, year: newYear, month: newMonth}, {where: {id: unikId  }}).then(result => {
                        return res.json({status:"success", message:"Vos modifications sont enregistrées sur la même couleur"});
                    }).catch(error =>{
                        return res.json({status:"failure", message:error.toString()});
                    });
                }  
            }

        }).catch(error =>{
            return res.json({status:"failure", message:error.toString()});
        });
    },
    removePicture:function(req,res){
        console.log(req.body);
        var unikId = req.body.id;
        var color = req.body.color;
        var picName = req.body.picName;

        models.photo.destroy({where: { id: unikId, color_name: color }}).then(pic => {
            return getPicturesByColor(color)
        }).then(pictures => {
            if (pictures.length == 0) {
                return res.json({status:"success", message:"La photo "+picName+" est supprimée. La galerie "+color+" est vide"});
            } else {
                for (let i = 0; i < pictures.length; i++) {
                    let newRank = i + 1;
                    models.photo.update({rank: newRank}, {where: {id: pictures[i].id  }})
                }
                return res.json({status:"success", message:"La photo "+picName+" est supprimée"});
            }
        }).catch(error =>{
            return res.json({status:"failure", message:error.toString()});
        });

    },
    getLastRankByColor:function(req,res){
        var currentColor = req.query.color;
        console.log(currentColor);
        models.photo.max('rank', { where: { color_name: currentColor } }).then(function(max) {
          console.log(max);
          return res.json({status:"success", data:max});
      }).catch(error =>{
        return res.json({status:"failure", message:error.toString()});
    });
  }
}

function countPicturesByColor(color) {
    return models.photo.count({where:{color_name: color }});
}

function getPicturesByColor(color) {
    return models.photo.findAll({where:{color_name: color }});
}