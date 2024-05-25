const Expense = require('../models/expenses');
const Sequelize = require('sequelize');

//add expenses
const addExpense = async (req, res, next) => {
    const {description, category, income, expense} = req.body;
    console.log("Expense add request received", req.body);
    if(!description || !category ){
        console.log('Expense data missing');
        return res.sendStatus(400);
    }

    try{
        const newExpense = await Expense.create({
            description: description,
            category: category,
            income: income,
            expense: expense,
            UserId: req.user.id
        });
        
        console.log('Expense added');
        return res.status(201).json({newExpense});

    }catch(error){
        console.log(error, JSON.stringify(error));
        res.status(500).json({error});
    }
};


// Getting expenses from database
const getExpense = async (req, res) => {
    try {
        const expenses= await Expense.findAll({
        where: {UserId: req.user.id},
        attributes: [
            'id', 'description', 'category', 'income', 'expense',
            [Sequelize.fn('date', Sequelize.col('createdAt')), 'dateOnly'] // Extracts only the date part
          ]
    });

    return res.status(200).json({expenses: expenses});
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
};


// Deleting expense
const deleteExpenses = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Expense.destroy({where: {id: id, UserId: req.user.id}})
        .then((rows)=>{
            if(rows === 0){
                return res.status(404).json({message: "Expense not found"});
            }
            return res.status(200).json({message: "Expense deleted"});
        });
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    addExpense,
    getExpense,
    deleteExpenses
}