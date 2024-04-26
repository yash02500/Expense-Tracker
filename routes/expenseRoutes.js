const express = require('express');

const routes = express.Router();

const expControl = require('../controllers/expController');

routes.post('/', expControl.addUser);
routes.post('/login', expControl.login);
routes.post('/addingExpense', expControl.addExpense);
routes.get('/getExpenses', expControl.getExpense);

module.exports = routes;