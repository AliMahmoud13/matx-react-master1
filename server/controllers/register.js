const User = require("../models/User");
const joi = require("joi");
const bcrypt = require("bcrypt");

const register = async (req, res, ) => {
  const { name, email, password } = req.body;
  const { error: validationError } = validateUser(req.body);

  try {
    if (validationError) {
      const error = new Error(validationError.details[0].message);
      error.statusCode = 400;
      throw error;
    }

    const formateName = name.toLowerCase();
    const formateEmail = email.toLowerCase();

    const finedUser = await User.findOne({ email: formateEmail });
    if (finedUser) {
      const error = new Error("this email already exists");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: formateName,
      email: formateEmail,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "user registered successfully", status: true });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      status: false,
      message: error.message || "حدث خطأ في الخادم",
    });
  }
};

module.exports = register;

function validateUser(data) {
  const userSchema = joi.object({
    name: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(12).required(),
  });

  return userSchema.validate(data);
}
