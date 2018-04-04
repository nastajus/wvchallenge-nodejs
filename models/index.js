'use strict';

let fs        = require('fs');
let path      = require('path');
let Sequelize = require('sequelize');
let basename  = path.basename(__filename);
let env       = process.env.NODE_ENV || 'development';
let config    = require(__dirname + '/../config/config.json')[env];
let db        = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

sequelize.authenticate()
	.then(() => {
		console.log('Connection to '+ config.dialect +' database \'' + config.database + '\' has been established successfully.');
	}).catch(err => {
	console.error('Unable to connect to the ' + config.dialect + ' database \'' + config.database + '\': ', err);
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    let model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.config = config;

module.exports = db;
