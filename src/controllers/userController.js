const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secrete_key = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, birthDate, email, password, role = 'user' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    birthDate,
    email,
    password: hashedPassword,
    role: req.body.isSpecial ? 'special' : 'user',
    isActive: false
  });

  await newUser.save();
  res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(401).json({ message: 'User account is not activated' });
  }    

  const token = jwt.sign({ id: user._id }, secrete_key, { expiresIn: '1d' });
  res.status(200).json({ message: 'Logged in successfully', token });
};

exports.activateUser = async (req, res) => {
  const { userId } = req.params;
  
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (existingUser.isActive) {
    return res.status(400).json({ message: 'User is already active' });
  }
  
  const updatedUser = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
  res.json({ message: 'User successfully activated', user: updatedUser });
};

exports.getUserInfo = async (req, res) => {
  const userId = req.userId;
  
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
};

exports.updateUser = async (req, res) => {
  const userId = req.userId;
  const updatedData = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ message: 'User updated successfully', user: updatedUser });
};

exports.getUsersByAge = async (req, res) => {
  const minAge = req.query.minAge;
  const currentDate = new Date();
  const minBirthDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - minAge));

  const users = await User.find({ birthDate: { $lte: minBirthDate } });
  res.status(200).json(users);
};
