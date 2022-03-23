const { Model, DataTypes } = require('sequelize');
const sequelize = require('./config');

class Notification extends Model {}

Notification.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_type: {
      type: DataTypes.ENUM('artisan','user','estimator','supervisor'),
      allowNull: true
  },
  read_at : {
    type: DataTypes.TIME,
    allowNull: true,
  },
  is_read : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
 // Timestamps
 created_at: DataTypes.DATE,
 update_at: DataTypes.DATE,
}, 
{ 
  sequelize, 
  modelName: 'notifications',
  timestamps: false
 });

module.exports = Notification;
module.exports.excludeColumns = ['updated_at','user_type'];
