const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const User = require('./user');
const Group = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type:Sequelize.STRING,
    allowNull: false
  },
  alternatename:{
    type:Sequelize.STRING,
    default:null
  },
  isGroupChat:{
    type:Sequelize.BOOLEAN,
    default:false
  },
  userlist:{
    type:Sequelize.STRING,
    allowNull: false,
  },
  groupAdmin:{
    type: Sequelize.INTEGER,
    allowNull: false,
  }

});

module.exports = Group;

