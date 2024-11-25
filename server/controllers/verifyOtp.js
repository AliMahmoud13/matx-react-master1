const User = require('../models/User')


const verifyOtp = async(req ,res ,next)=>{
    const {otp} = req.body

    try {

        const foundUser = await User.findOne({'otp.otp':otp})
        if(!foundUser){
            const error = new Error('invalid otp')
            error.statusCode = 400
            throw error
        }
        if(new Date(foundUser.otp.sendTime).getTime() < new Date().getTime()){
            const error = new Error('otp expired')
            error.statusCode = 400;
            throw error
        }

        foundUser.otp.otp = null;
        await foundUser.save();
        res.status(201).json({message: "otp verified",status:true});
        
    } catch (error) {
        next(error)
    }
}

module.exports = verifyOtp