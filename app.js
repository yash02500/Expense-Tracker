const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const expenseRoute = require('./routes/expenseRoutes');
const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/expense', expenseRoute);


sequelize.sync()
.then(() => {
 app.listen(3000, () => {
  console.log('server is running');
   app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
   })
  });
 })
.catch((err) => console.log(err));
    
    