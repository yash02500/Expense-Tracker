const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const User= require('./user');

const downloadList= sequelize.define('DownloadedReport',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileUrl:{
        type: Sequelize.STRING,
        allownull: false
    }

});

downloadList.belongsTo(User);
module.exports = downloadList;