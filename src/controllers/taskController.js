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

// Controlador para agregar un árbol de tareas
exports.addTaskTree = async (req, res, next) => {
  try {
    // El cuerpo de la solicitud debe contener el JSON anidado o array anidado del árbol de tareas
    const taskTree = req.body;

    // Llamar a una función recursiva para crear las tareas en el árbol
    const createdTasks = await createTasksRecursive(null, taskTree);

    res.status(201).json(createdTasks);
  } catch (error) {
    next(error);
  }
};

// Función recursiva para crear tareas en el árbol
const createTasksRecursive = async (parentId, taskDataArray) => {
  const createdTasks = [];

  for (const taskData of taskDataArray) {
    // Crea una nueva tarea con la información proporcionada y establece el parentId
    const newTaskData = {
      ...taskData,
      parentId,
    };

    const newTask = new Task(newTaskData);
    await newTask.save();

    // Si la tarea tiene subtareas, llamar recursivamente para crearlas
    if (taskData.subtasks && taskData.subtasks.length > 0) {
      // Imprimimos las tareas que vamos a crear taskData.subtasks
      console.log('Tareas que vamos a crear', taskData.subtasks);
      const subtasks = await createTasksRecursive(newTask._id, taskData.subtasks);
      newTask.subtasks = subtasks;
      await newTask.save();
    }

    createdTasks.push(newTask);
  }

  return createdTasks;
};

// Obtener una tarea con su árbol de subtareas (función recursiva)
exports.getTaskWithSubtasks = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    // Función recursiva para obtener todas las subtareas de una tarea
    const getSubtasksRecursive = async (taskId) => {
      const task = await Task.findById(taskId);

      if (!task) {
        return null;
      }

      // Buscar todas las subtareas de la tarea actual
      const subtasks = await Task.find({ parentId: taskId });

      // Inicializar un objeto para almacenar la tarea actual y sus subtareas
      const taskWithSubtasks = {
        task,
        subtasks: [],
      };

      // Recorrer las subtareas y llamar a la función recursiva para cada una
      for (const subtask of subtasks) {
        const subtaskWithSubtasks = await getSubtasksRecursive(subtask._id);
        if (subtaskWithSubtasks) {
          taskWithSubtasks.subtasks.push(subtaskWithSubtasks);
        }
      }

      return taskWithSubtasks;
    };

    // Llamar a la función recursiva para obtener la tarea con su árbol de subtareas
    const taskWithSubtasks = await getSubtasksRecursive(taskId);

    if (!taskWithSubtasks) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(taskWithSubtasks);
  } catch (error) {
    next(error);
  }
};



