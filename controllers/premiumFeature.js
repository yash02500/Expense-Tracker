const Expense = require('../models/expenses');
const User = require('../models/user');
const DownloadLists = require('../models/downloadList');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

// Return users expenses for showing on leaderboard 
const leaderboard = async (req, res) => {
    try{
        const leaderboardList = await User.findAll({
            attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expense')), 'total_cost'] ],
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


// uploadToS3
const uploadToS3 = async (data, filename) => {
    // const BUCKET_NAME = process.env.BUCKET_NAME;
    // const IAM_USER_KEY = process.env.IAM_USER_KEY;
    // const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    // const s3bucket = new AWS.S3({
    //     accessKeyId: IAM_USER_KEY,
    //     secretAccessKey: IAM_USER_SECRET,
    //     Bucket: BUCKET_NAME
    // });

    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    };

    try {
        const uploadResult = await s3bucket.upload(params).promise();
        console.log('File uploaded successfully:', uploadResult.Location);
        return uploadResult.Location;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; 
    }
};


// Downloading repots 
const downloadReports = async (req, res, next) => {
    try{
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);

    const userId = req.user.id; 
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    res.status(200).json({fileURL, success: true});

    await DownloadLists.create({
        fileUrl: fileURL,
        UserId: userId
    });
    console.log('URL added to database');
    
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}


//Download Lists
const downloadList = async (req, res, next) => {
    try {
        const urlList = await DownloadLists.findAll({ where: {UserId: req.user.id}});
        res.status(200).json(urlList)
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}


// User balance
const userBalance = async (req, res, next) => {
    try {
        // Find all records for the user
        const records = await Expense.findAll({ where: { UserId: req.user.id } });

        // Sum up all income amounts
        let totalIncome = records.reduce((sum, record) => sum + (record.income || 0), 0);
        console.log('Total Income:', totalIncome);
        
        let totalExpense = records.reduce((sum, record) => sum + (record.expense || 0), 0);
        console.log('Total Expense:', totalExpense);
        
        // Calculate the total balance
        let total = totalIncome - totalExpense;
        let balanceStr = `${total.toFixed(2)}`;
        res.status(200).json(balanceStr);

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}


module.exports = {
    leaderboard,
    downloadReports,
    downloadList,
    userBalance
}