const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: String,
    birthDate: Date,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'special'],
        default: 'user'
    },
    isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
