'use strict';
var models = require('./');

module.exports = function(sequelize, DataTypes) {
  var photo = sequelize.define('photo', {
    place: DataTypes.STRING,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    file_name: DataTypes.STRING,
    thumb_name: DataTypes.STRING,
    size: DataTypes.STRING,
    orientation: DataTypes.STRING,
    name: DataTypes.STRING,
    color_name: DataTypes.STRING,
    rank: DataTypes.INTEGER
}, {
    classMethods: {
      associate: function(models) {
        photo.belongsTo(models.color);
      }
    }
  });
  return photo;
};