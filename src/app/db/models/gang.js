const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class ArtisanGang extends Model {}

ArtisanGang.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: DataTypes.STRING,
  gang_head_id: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  service_category_id: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  logo : {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio : {
    type: DataTypes.TEXT,
    allowNull: true,
    
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    default: false
  },
  rating: DataTypes.FLOAT,
  // Timestamps
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'artisan_gangs',
  underscored: true,
  timestamps: false
 });

module.exports = ArtisanGang;