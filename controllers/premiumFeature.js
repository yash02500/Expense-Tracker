const Expense = require('../models/expenses');
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

// Return users expenses for showing on leaderboard 
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


// uploadToS3
const uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    const s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
    });

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
    
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}


module.exports = {
    leaderboard,
    downloadReports
}