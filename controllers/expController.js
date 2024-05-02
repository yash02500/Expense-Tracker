const Expense = require('../models/expenses');

//add expenses
exports.addExpense = async (req, res, next) => {
    const {amount, description, category} = req.body;
    console.log("Expense add request received", req.body);
    if(!amount || !description || !category){
        console.log('Expense data missing');
        return res.sendStatus(400);
    }

    try{
        const newExpense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
            UserId: req.user.id
        });
        console.log('Expense added');
        return res.status(201).json({newExpense});

    }catch(error){
        console.log(error, JSON.stringify(error));
        res.status(500).json({error});
    }
};


// Getting expenses
exports.getExpense = async (req, res) => {
    try {
        const expenses= await Expense.findAll({where: {UserId: req.user.id}});
         return res.status(200).json({expenses: expenses});
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
};


// Deleting expense
exports.deleteExpenses = async (req, res, next) => {
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

