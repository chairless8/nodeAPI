const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, birthDate, email, password, role = 'user' } = req.body;

  // Verificar si el correo electrónico ya está en uso
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  
  // Hash del password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};
