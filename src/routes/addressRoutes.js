const express = require('express');
const { check, validationResult } = require('express-validator');
const AddressController = require('../controllers/AddressController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/address
router.post('/',
  [
    check('country', 'Country is required').notEmpty(),
    check('state', 'State is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('street', 'Street is required').notEmpty(),
    check('postalCode', 'Postal Code is required').notEmpty(),
  ],
  authMiddleware,
  AddressController.createAddress
);

router.get('/', authMiddleware, AddressController.getAddressByUserId);
router.put('/:addressId', authMiddleware, AddressController.updateAddress);


module.exports = router;
