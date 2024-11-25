const User = require("../models/User");
const crypto = require('crypto')
const sendMail = require('../utils/sendMail') 
const forgetPassword = async (req,res,next)=>{

const {email} = req.body;
try {

    const formattedEmail = email.toLowerCase();

    const foundUser = await User.findOne({email:formattedEmail});
    if(!foundUser) {
        const error = new Error("no user found");
        error.statusCode = 400;
        throw error;
    };

    if(foundUser.otp.otp && 
      new Date(foundUser.otp.sendTime).getTime() > new Date().getTime()
    ) {
        const error = new Error(
          `please wait until ${new Date(
            foundUser.otp.sendTime
          ).toLocaleTimeString()}`
          );

          if (foundUser.otp && foundUser.otp.otp && foundUser.otp.sendTime) {
            const waitTime = 2 * 60 * 1000; // 2 minutes in milliseconds
            const currentTime = new Date().getTime();
            const lastSendTime = new Date(foundUser.otp.sendTime).getTime();
            
            if (currentTime - lastSendTime < waitTime) {
              const remainingTime = Math.ceil((waitTime - (currentTime - lastSendTime)) / 1000);
              const error = new Error(
                `الرجاء الانتظار ${new Date} ثانية قبل طلب رمز جديد.`
              );
              error.statusCode = 429; // Too Many Requests
              throw error;
            }
          }
          error.statusCode = 400;
          throw error;
    };

    const otp = Math.floor(Math.random() * 9000) +100000;


    const token = crypto.randomBytes(32).toString('hex')

    foundUser.otp.otp = otp;
    foundUser.otp.sendTime = new Date().getTime() +1*60*1000;
    foundUser.otp.token = token;



    await foundUser.save()
    sendMail(otp,  formattedEmail);

    
    res
      .status(201)
      .json({ message: "OTP sent successfully", status: true ,
      
      token,
     });

} catch (error) {
    
    console.error('Error in forgetPassword:', error)
      res.status(500).json({ error: 'An error occurred while processing your request' })
    
};
};


module.exports = forgetPassword
