// const { RelationshipType } = require('sequelize/lib/errors/database/foreign-key-constraint-error');
const User = require('../models/user');
const Expense = require('../models/expenses');
const bcrypt = require('bcrypt');
const path= require('path');

//User sign up 
exports.addUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log("Request received", req.body);
    if(!name || !email || !password){
        console.log('Values missing');
        return res.sendStatus(500);
    }

    try{
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            console.log('Email already exists');
            return res.status(409).send('Email already exists');
        }

        bcrypt.hash(password, 10, async (err, hash) => {
        console.log(err);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hash,
        })
        console.log('User added');
        res.status(201).json(newUser)
    })

    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(500).json({error})
    }
};


//User login
exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Login Request received", req.body);
    if(!email || !password){
        console.log('Login Values missing');
        return res.sendStatus(400);
    }

    try{
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            console.log('Email not found');
            return res.status(404).send('Email not found');
        }

        bcrypt.compare(password, user.password, (err, result)=>{
            if(err){
                throw new Error("Something went wrong");
            }
            
            if(result){
                res.sendFile(path.join(__dirname, "..", "public", "addExpense.html"));
            }

            else{
                res.status(401).send('Incorrect password');
            }
        });

    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(501).json({error})
    }
};


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
            category: category
        });
        console.log('Expense added');
        res.status(201).json(newExpense);

    }catch(error){
        console.log(error, JSON.stringify(error));
        res.status(500).json({error});
    }
};


// Getting expenses
exports.getExpense = async (req, res) => {
    try {
        const expenses= await Expense.findAll();
        res.status(200).json({expenses: expenses});
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
};