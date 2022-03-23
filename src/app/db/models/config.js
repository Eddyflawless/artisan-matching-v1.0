
const { Sequelize } = require('sequelize');

var config =  {
    // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
    // This was true by default, but now is false by default
    timestamps: false
 }
  const sequelize = new Sequelize('toast_db', 'dustbin', '', {
    host: '127.0.0.1',
    dialect:  'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
  });

  sequelize.authenticate().then(()=>{
    console.log('Connection to MYSQL database has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
    //send error to sentry
  });

module.exports = sequelize;
