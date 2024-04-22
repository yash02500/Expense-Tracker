const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense_tracker', 'root', '72sqlyash', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;

