const Sequelize= require('sequelize');

const sequelize = new Sequelize('online_shopping', 'root', 'iitrc1@34', {
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;