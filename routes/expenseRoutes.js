const express = require('express');

const routes = express.Router();

const expControl = require('../controllers/expController');

routes.post('/', expControl.addUser);

module.exports = routes;