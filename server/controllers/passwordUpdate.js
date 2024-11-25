const User = require('../models/User');
const bcrypt = require('bcrypt');

const updatePassword = async(req, res, next)=>{

    const {password,confirmPassword,token} = req.body;

    try {

        const foundUser = await User.findOne({'otp.token':token});
        if(!foundUser){
            const error = new Error('something went wrong');
            error.statusCode = 400;
            throw error;
        }

        if(
            new Date(foundUser.otp.sendTime).getTime() + 5* 60 * 1000 <
            new Date().getTime()
        ){
            const error = new Error('something went wrong please try again later');
            error.statusCode = 400;
            throw error;
        }


        if(password !== confirmPassword) {
            const error = new Error('password dose not match');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password,10)

        foundUser.password = hashedPassword
        foundUser.otp.sendTime = null
        foundUser.otp.token = null
        await foundUser.save()

        res
        .status(201)
        .json({Message:'password updated successfully'
            ,status:true
        })
        
    } catch (error) {
        res.status(error.statusCode).json({
      status: false,
      message: error.message || "حدث خطأ في الخادم",
    });
    }
}

module.exports = updatePassword;