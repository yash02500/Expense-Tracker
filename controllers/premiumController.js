const Razorpay = require('razorpay');
const Order = require('../models/orders');
const userController = require('../controllers/userController');

exports.buyPremium = async(req, res)=>{
    try{
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 100;

        const order = await rzp.orders.create({amount, currency: 'INR'});
            await req.user.createOrder({
                orderid: order.id,
                status: 'PENDING'
            });
            return res.status(201).json({order, key_id: rzp.key_id});
            
            } catch(err){
                console.log(err);
                res.status(500).json({ message: 'Something went wrong', error: err });
            }   
       }


// updateTransactionStatus
exports.updateTransactionStatus = async(req, res) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ isPremiumuser: true }) 

        await Promise.all([promise1, promise2]);
        return res.status(202).json({success: true, message: "Transaction Successful", token: userController.generateToken(userId, true) });
               
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Sometghing went wrong with update' })
    }
};
