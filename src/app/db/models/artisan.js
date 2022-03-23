const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class Artisan extends Model {}

Artisan.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  artisan_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  service_category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_active: DataTypes.BOOLEAN,
  is_flagged: DataTypes.BOOLEAN,
  fb_token: DataTypes.STRING,
  rating: DataTypes.FLOAT,
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Timestamps
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'artisans',
  timestamps: false,
  underscoredAll: true
 });

module.exports = Artisan;