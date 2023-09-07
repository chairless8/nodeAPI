const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


exports.login = async (req, res) => {
    // 1. Validar datos del usuario (esto debería hacerse con express-validator en las rutas)
    const { email, password } = req.body;
  
    // 2. Buscar usuario por email
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // 3. Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // 4. Crear token (opcional)
      const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
  
      // 5. Responder al cliente
      res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
