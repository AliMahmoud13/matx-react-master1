const User = require('../models/User');


const getAccess = async (req, res, next)=> {
    const {token} = req.body;

    try {

        const foundUser = await User.findOne({'otp.token': token})


    } catch (error) {
        next(error)
    }
}