const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User = require('./user');
const Group = require('./group');

const userGroup = sequelize.define('usergroup', {
      userid: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
         }   
      },
      groupid: { 
        type: Sequelize.INTEGER,
        references: {
           model: "groups",
           key: "id",
        }
    }

});

module.exports = userGroup;

