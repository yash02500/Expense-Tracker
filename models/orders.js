const Sequelize = require('sequelize');
const sequelize = require('../util/database')
const User = require('./user');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
})

Order.belongsTo(User);
module.exports = Order;