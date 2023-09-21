const Progress = require('../models/Progress');

// Crear un nuevo registro de progreso
exports.createProgress = async (req, res, next) => {
    try {
        const newProgress = new Progress(req.body);
        await newProgress.save();
        res.status(201).json(newProgress);
    } catch (error) {
        next(error);
    }
};

// Obtener un registro de progreso por ID
exports.getProgress = async (req, res, next) => {
    try {
        const progress = await Progress.findById(req.params.id);
        if (!progress) {
            const error = new Error('Progress not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(progress);
    } catch (error) {
        next(error);
    }
};

// Actualizar un registro de progreso
exports.updateProgress = async (req, res, next) => {
    try {
        const updatedProgress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProgress) {
            const error = new Error('Progress not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(updatedProgress);
    } catch (error) {
        next(error);
    }
};

// Eliminar un registro de progreso
exports.deleteProgress = async (req, res, next) => {
    try {
        const deletedProgress = await Progress.findByIdAndDelete(req.params.id);
        if (!deletedProgress) {
            const error = new Error('Progress not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Progress deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Obtener progreso de un usuario en un rango de fechas
exports.getUserProgressByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.params.id;

        const progressRecords = await Progress.find({
            user: userId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        res.status(200).json(progressRecords);
    } catch (error) {
        next(error);
    }
};
