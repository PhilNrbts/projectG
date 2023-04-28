// controllers/userController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
  console.log(`[${new Date().toISOString()}] Register user called`);
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userCount = await User.countDocuments();
    const userId = `u${userCount + 1}`;

    const newUser = await User.create({
      userId,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
  console.log(`[${new Date().toISOString()}] Register user finished`);
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateUser = async (req, res) => {
  
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(id, { username, email, password: hashedPassword }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUserGameHistory = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('gameHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ gameHistory: user.gameHistory });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  logoutUser,
  getUserGameHistory,
};

