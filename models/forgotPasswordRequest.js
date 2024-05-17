const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    uuid: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // isActive: {
    //     type: Sequelize.BOOLEAN,
    // }
});

module.exports = forgotPasswordRequest;