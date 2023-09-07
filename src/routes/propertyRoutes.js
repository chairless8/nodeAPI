// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para buscar propiedades
router.get('/', authMiddleware, propertyController.listProperties);


module.exports = router;
