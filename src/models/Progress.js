const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    habit: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: false },
    status: {
        type: String,
        enum: ['completed', 'skipped', 'in-progress'],
        default: 'in-progress'
    },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Progress', ProgressSchema);
