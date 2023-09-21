const Habit = require('../models/Habit');

exports.createHabit = async (req, res, next) => {
    try {
        const newHabit = new Habit(req.body);
        await newHabit.save();
        res.status(201).json(newHabit);
    } catch (error) {
        next(error);
    }
};

exports.getHabit = async (req, res, next) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            const error = new Error('Habit not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(habit);
    } catch (error) {
        next(error);
    }
};

exports.updateHabit = async (req, res, next) => {
    try {
        const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHabit) {
            const error = new Error('Habit not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(updatedHabit);
    } catch (error) {
        next(error);
    }
};

exports.deleteHabit = async (req, res, next) => {
    try {
        const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
        if (!deletedHabit) {
            const error = new Error('Habit not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getUserHabits = async (req, res, next) => {
    console.log('aqui vamos')
    try {
        const habits = await Habit.find({ userId: req.params.userId });
        res.status(200).json(habits);
    } catch (error) {
        next(error);
    }
};

