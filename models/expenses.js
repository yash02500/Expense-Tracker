const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Expenses= sequelize.define('Expenses',{
    amount:{
        type: Sequelize.INTEGER,
        allownull: false
    },
    description:{
        type: Sequelize.STRING,
        allownull: false
    },
    category:{
        type: Sequelize.STRING,
        allownull: false
    }
});

module.exports = Expenses;