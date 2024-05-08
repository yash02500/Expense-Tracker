const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
dotenv.config();

//User sign up 
const addUser = async (req, res, next) => {
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


// Generating jwt token
const generateToken = (id, isPremiumuser) =>{
    return jwt.sign({userId: id, isPremiumuser}, '7yv3ydbn324320rdnewod39dn4urybfece');
};

//User login
const login = async (req, res, next) => {
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
                res.status(200).json({message:"Login successful", token: generateToken(user.id, user.isPremiumuser)}); 
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


// Forgot password
const forgotPassword = async (req, res, next) => {
    const client = Sib.ApiClient.instance;

// Authentication with the API key
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const userMail = req.body.email;
    console.log("Login Request received", req.body);
    if(!userMail){
        console.log('Email missing');
        return res.sendStatus(400);
    }

    try{
        const user = await User.findOne({ where: { email: userMail }});
        if (!user) {
            console.log('User not found');
            return res.status(404).send('User not found');
        }

        const sender = {
        email: 'yashv0482@gmail.com'
    };

        const receivers = [
        {
            email: userMail,
        },
    ];

        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Forgot Password',
            textContent: 'Here is your link to reset your password',
        });
        console.log(response);
        res.status(200).json({message: 'password reset link sent to your email', response});
    
    }catch (error) {
        console.error(error);
    }
};


module.exports = {
    addUser,
    login,    
    generateToken,
    forgotPassword
};


