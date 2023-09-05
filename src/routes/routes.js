const express = require('express');
const router = express.Router();

const userRoutes = require('./users');
const addressRoutes = require('./addressRoutes');

// Montar las rutas específicas
router.use('/user', userRoutes);
router.use('/address', addressRoutes);


module.exports = router;
