'use strict';
var models = require('./');

module.exports = function(sequelize, DataTypes) {
  var color = sequelize.define('color', {
    name: DataTypes.STRING,
    hexacode: DataTypes.STRING
}, {
    classMethods: {
      associate: function(models) {
        color.hasMany(models.photo);
      }
    }
  });
  return color;
};