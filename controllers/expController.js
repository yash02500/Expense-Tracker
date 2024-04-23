const User = require('../models/signup');

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

        const isValidPassword= user.password === password;
        if(!isValidPassword){
            console.log('Invalid password');
            return res.status(401).send('Invalid password');
        }

        console.log('Login success');
        res.status(200).json({ message: 'Login success', user: user });

    } catch (error) {
        console.log(error, JSON.stringify(error))
        res.status(501).json({error})
    }
}