const User = require('../models/signup');

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

        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
        });

        console.log('User added');

        res.status(201).json(newUser)
    } catch (error) {
        console.log(error, JSON.stringify(error))

        res.status(501).json({error})
    }
}
