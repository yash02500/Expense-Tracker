const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumFeatureController = require('../controllers/premiumFeature');
const routes = express.Router();

routes.get('/leaderboard', userAuthentication.authenticate, premiumFeatureController.leaderboard);

module.exports = routes;