const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta para registrar usuarios
router.post('/register',
[
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('birthDate')
      .custom((value) => {
        if (moment().diff(moment(value), 'years') >= 18) {
          return true;
        }
        return false;
      }).withMessage('User must be at least 18 years old'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[a-zA-Z]/).withMessage('Password must contain letters')
      .matches(/\d/).withMessage('Password must contain numbers')
  ],
  userController.register
);


router.patch('/activate/:userId', userController.activateUser);

// Ruta para iniciar sesión
router.post('/login',
[
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
],
userController.login
);

// Ruta para actualizar la informacion del usuario
router.put('/me', authMiddleware, userController.updateUser);

// Ruta para obtener información del usuario, protegida
router.get('/me', authMiddleware, userController.getUserInfo);


router.get('/usersByAge', authMiddleware, userController.getUsersByAge);




module.exports = router;
