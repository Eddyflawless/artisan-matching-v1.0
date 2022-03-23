const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config');

class User extends Model {}

User.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: DataTypes.ENUM("male","female"),
  languages: DataTypes.STRING,
  surname: DataTypes.STRING,
  other_names: DataTypes.STRING,
  phone_number: DataTypes.STRING,
  email: DataTypes.STRING,
  region_id: DataTypes.INTEGER,
  fb_token: DataTypes.STRING,
  is_active: DataTypes.BOOLEAN,
  is_flagged: DataTypes.BOOLEAN,
 // Timestamps
 created_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'user',
  underscoredAll: true,
  timestamps: false
 });

module.exports = User;
module.exports.excludeColumns = ['updated_at','password','r_password','otp','created_at','role_id'];
