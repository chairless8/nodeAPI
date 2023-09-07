const express = require('express');
const router = express.Router();

const userRoutes = require('./usersRoutes');
const addressRoutes = require('./addressRoutes');
const propertyRoutes = require('./propertyRoutes');

// Montar las rutas específicas
router.use('/user', userRoutes);
router.use('/address', addressRoutes);
router.use('/properties', propertyRoutes);


module.exports = router;
