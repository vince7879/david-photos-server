'use strict';
var models = require('./');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    login: DataTypes.STRING,
    password: DataTypes.STRING
    }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};