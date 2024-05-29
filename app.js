const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const expenseRoute = require('./routes/expenseRoutes');
const userRoute = require('./routes/userRoutes');
const premiumRoute = require('./routes/premiumRoutes');
const premiumFeatures = require('./routes/premiumFeaturesRoutes');

const sequelize = require('./util/database');

const Expenses = require('./models/expenses');
const User = require('./models/user');
const Order = require('./models/orders');
const ForgotPassword = require('./models/forgotPasswordRequest');
 const DownloadList = require('./models/downloadList');

dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/expense', expenseRoute);
app.use('/user', userRoute);
app.use('/premium', premiumRoute);
app.use('/premiumFeature', premiumFeatures);

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadList);
DownloadList.belongsTo(User);

sequelize.sync()
.then(() => {
 app.listen(3000, () => {
  console.log('server is running');
   app.get('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, "public", "addExpense.html"));
    })
  });
 })
.catch((err) => console.log(err));
    
    