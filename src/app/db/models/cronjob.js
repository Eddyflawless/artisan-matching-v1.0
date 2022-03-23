const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class CronJob extends Model {}

CronJob.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  skip: DataTypes.INTEGER,
  size: DataTypes.INTEGER,
  status: DataTypes.BOOLEAN,
  // Timestamps
  updated_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'cron_bg_task',
  timestamps: false
 });

module.exports = CronJob;