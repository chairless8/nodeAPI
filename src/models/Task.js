const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    parentId : { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isCompleted: { type: Boolean, default: false },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    difficulty: { type: String },
    likelihood: { type: Number },
    completionDate: { type: Date },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        default: null // Si la tarea no está asociada a un hábito en particular.
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
