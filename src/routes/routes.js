const express = require('express');
const router = express.Router();

const userRoutes = require('./users');

// Montar las rutas específicas del usuario
router.use('/user', userRoutes);

module.exports = router;
