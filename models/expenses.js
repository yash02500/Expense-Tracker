const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const User= require('./user');

const Expenses= sequelize.define('Expenses',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // amount:{
    //     type: Sequelize.INTEGER,
    //     allownull: false
    // },
    description:{
        type: Sequelize.STRING,
        allownull: false
    },
    category:{
        type: Sequelize.STRING,
        allownull: false,
    },
    // type:{
    //     type: Sequelize.STRING,
    //     allowNull: false
    // }
    income:{
        type: Sequelize.INTEGER,
    },
    expense:{
        type: Sequelize.INTEGER,
    }

});

Expenses.belongsTo(User);
module.exports = Expenses;