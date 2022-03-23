const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class Job extends Model {}

Job.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  job_type: {
    type: DataTypes.ENUM("quick","gang"),
    defaultValue: "quick"
  },
  service_category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: { 
    type: DataTypes.STRING,
  },

  description: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requirements: DataTypes.STRING,
  status: DataTypes.STRING,
  lat: { 
    type: DataTypes.FLOAT,
  },
  lng: { 
    type: DataTypes.FLOAT,
  },
  reviews: DataTypes.STRING,
  address: DataTypes.STRING,
  requested_date: DataTypes.DATE,
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  rating: DataTypes.FLOAT,
  // Timestamps
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'jobs',
  timestamps: false
 });

module.exports = Job;