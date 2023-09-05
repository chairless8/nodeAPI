const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Address = require('../models/Address');
const User = require('../models/User');

// POST /api/address
router.post('/',
  [
    check('country', 'Country is required').notEmpty(),
    check('state', 'State is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('street', 'Street is required').notEmpty(),
    check('postalCode', 'Postal Code is required').notEmpty(),
    check('userId', 'User ID is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { country, state, city, street, postalCode, userId } = req.body;

    try {
      // Verifica si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const newAddress = new Address({
        country,
        state,
        city,
        street,
        postalCode,
        user: userId
      });

      await newAddress.save();
      res.json(newAddress);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
