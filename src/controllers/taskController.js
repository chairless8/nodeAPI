const Task = require('../models/Task');

// Create a new Task
exports.createTask = async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// Get a specific Task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Update a Task
exports.updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// Delete a Task
exports.deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Complete a Task
exports.completeTask = async (req, res, next) => {
  try {
    const completedTask = await Task.findByIdAndUpdate(req.params.id, { isCompleted: true }, { new: true });
    if (!completedTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(completedTask);
  } catch (error) {
    next(error);
  }
};

// Uncomplete a Task
exports.uncompleteTask = async (req, res, next) => {
  try {
    const uncompletedTask = await Task.findByIdAndUpdate(req.params.id, { isCompleted: false, completionDate: null }, { new: true });
    if (!uncompletedTask) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(uncompletedTask);
  } catch (error) {
    next(error);
  }
};

// Get Sub-Tasks of a specific Task
exports.getSubTasks = async (req, res, next) => {
  try {
    const subTasks = await Task.find({ parentId: req.params.id });
    res.status(200).json(subTasks);
  } catch (error) {
    next(error);
  }
};


// Obtener las tareas asociadas a un hábito específico
exports.getHabitTasks = async (req, res, next) => {
  try {
      const tasks = await Task.find({ habitId: req.params.id });
      if (!tasks) {
          return res.status(404).json({ message: 'Tasks for this habit not found' });
      }
      res.status(200).json(tasks);
  } catch (error) {
      next(error);
  }
};
