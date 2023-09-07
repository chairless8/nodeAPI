const { validationResult } = require('express-validator');
const Address = require('../models/Address');
const User = require('../models/User');

exports.createAddress = async (req, res) => {
    const userId = req.userId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { country, state, city, street, postalCode } = req.body;

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
    res.status(201).json(newAddress);
};

exports.getAddressByUserId = async (req, res) => {
    const userId = req.userId;
    const addresses = await Address.find({ user: userId });
    if (!addresses || addresses.length === 0) {
        return res.status(404).json({ msg: 'Addresses not found' });
    }
    res.status(200).json(addresses);
};

exports.updateAddress = async (req, res) => {
    const addressId = req.params.addressId;
    const { country, state, city, street, postalCode } = req.body;

    const address = await Address.findByIdAndUpdate(
        addressId,
        { country, state, city, street, postalCode },
        { new: true }
    );

    if (!address) {
        return res.status(404).json({ msg: 'Address not found' });
    }

    res.status(200).json(address);
};
