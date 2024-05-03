const express = require('express');
const userAuthentication = require('../middleware/auth');
const routes = express.Router();

routes.get('/leaderboard', userAuthentication.authenticate);

module.exports = routes;