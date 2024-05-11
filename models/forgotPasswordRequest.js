const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const forgotPasswordRequest = sequelize.define('ForgotPasswordRequest', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
    }
});

module.exports = forgotPasswordRequest;