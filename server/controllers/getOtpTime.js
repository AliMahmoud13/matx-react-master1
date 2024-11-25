const User = require('../models/User')


const getOtpTime = async(req,res,next)=>{
    const {token} = req.body

    try {
        
        const foundUser = await User.findOne({'otp.token':token}).select(
            'otp'
        );

       

        if(!foundUser){
            const error = new Error('something went wrong');
            error.statusCode = 400;
            throw error;
        }

        res
        .status(201)
        .json({message:'success',
            status:true,
            sendTime:foundUser.otp.sendTime,
        })

    } catch (error) {
        next(error);
    }
};

module.exports = getOtpTime