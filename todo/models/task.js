"use strict"

module.exports = function(sequelize, DataTypes) {
  var Task = sequelize.define("Task", {},
      {
        classMethods: {
          associate: function(models) {
            Task.belongsTo(models.User);
          }
        }
     });

  return Task;
}
