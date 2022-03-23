const { Model, DataTypes } = require('sequelize');

const sequelize = require('./config');

class ApiClient extends Model {}

ApiClient.init({
  id:  {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  client_id: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  client_secret: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  host: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Timestamps
  created_at: DataTypes.DATE,
}, { 
  sequelize, 
  modelName: 'api_clients',
  timestamps: false,
  underscoredAll: true
 });

module.exports = ApiClient;