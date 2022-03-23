const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class JobRequest extends Model {}

JobRequest.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  job_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  artisan_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  distance: DataTypes.STRING,
  // Timestamps
  created_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'job_requests',
  underscored: true,
  timestamps: false
 });

module.exports = JobRequest;