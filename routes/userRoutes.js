const express = require('express');
const routes = express.Router();
const userControll = require('../controllers/userController');

routes.post('/signup', userControll.addUser);
routes.post('/login', userControll.login);
routes.post('/password/forgotpassword', userControll.forgotPassword);
routes.post('/password/forgotpassword/:id', userControll.forgotPasswordUser);

module.exports = routes;