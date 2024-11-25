const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { email, password } = req.body;

 

  try {
    const formattedEmail = email.toLowerCase();


    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", status: false });
    }
  

    const user = await User.findOne({ email: formattedEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", status: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials", status: false });
    }

    // Add a small delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 100));

    const accessToken = jwt.sign(
      { email: formattedEmail, userId: user._id },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "7d" }
    );

    res
    .status(201)
    .json({ message: "Login successful", status: true, token: accessToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "An error occurred during login", status: false });
  }
};

module.exports = login;