const Tag = require('../models/Tag');

// Crear nueva etiqueta
exports.createTag = async (req, res, next) => {
    try {
        const newTag = new Tag(req.body);
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        error.statusCode = 400;
        error.message = 'Error creating tag';
        next(error);
    }
};

// Obtener todas las etiquetas de un usuario
exports.getUserTags = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const tags = await Tag.find({ userId });
        res.status(200).json(tags);
    } catch (error) {
        error.statusCode = 400;
        error.message = 'Error getting tags';
        next(error);
    }
};

// Obtener una etiqueta específica por ID
exports.getTag = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            const err = new Error('Tag not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json(tag);
    } catch (error) {
        next(error);
    }
};

// Actualizar una etiqueta
exports.updateTag = async (req, res, next) => {
    try {
        const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTag) {
            const err = new Error('Tag not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json(updatedTag);
    } catch (error) {
        next(error);
    }
};

// Eliminar una etiqueta
exports.deleteTag = async (req, res, next) => {
    try {
        const deletedTag = await Tag.findByIdAndDelete(req.params.id);
        if (!deletedTag) {
            const err = new Error('Tag not found');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        next(error);
    }
};
