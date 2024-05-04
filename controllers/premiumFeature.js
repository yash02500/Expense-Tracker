const Expense = require('../models/expenses');
const User = require('../models/user');
const sequelize = require('../util/database');

const leaderboard = async (req, res) => {
    try{
        const leaderboardList = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost'] ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group:['user.id'],
            order:[['total_cost', 'DESC']]

        })
       
        res.status(200).json(leaderboardList)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    leaderboard
}