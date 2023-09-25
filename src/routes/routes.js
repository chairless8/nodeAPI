const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const userController = require('../controllers/userController');
const habitController = require('../controllers/habitController');
const taskController = require('../controllers/taskController');
const progressController = require('../controllers/progressController');
const tagController = require('../controllers/tagController');
// const identityController = require('../controllers/identityController'); // Opcional por ahora

// Rutas para Usuario
router.post('/user/create', userController.createUser);
router.post('/user/login', userController.login);
router.get('/user/me',authMiddleware , userController.getUserInfo);
router.get('/user/:id', userController.getUser);
router.put('/user/:id/update', userController.updateUser);
router.delete('/user/:id/delete', userController.deleteUser);

// Rutas para Hábito
router.post('/habit/create', habitController.createHabit);
router.get('/habit/:id', habitController.getHabit);
router.put('/habit/:id/update', habitController.updateHabit);
router.delete('/habit/:id/delete', habitController.deleteHabit);
router.get('/habit/:userId/habits', habitController.getUserHabits);

//Habitos + Tareas
router.get('/habit/:id/tasks', taskController.getHabitTasks);
// Rutas para Tarea
router.post('/task/create', taskController.createTask);
router.get('/task/:id', taskController.getTask);
router.put('/task/:id/update', taskController.updateTask);
router.delete('/task/:id/delete', taskController.deleteTask);
router.post('/task/:id/complete', taskController.completeTask);
router.post('/task/:id/uncomplete', taskController.uncompleteTask); // Descompletar tarea
router.get('/task/:id/subtasks', taskController.getSubTasks);

// Ruta para agregar un árbol de tareas
router.post('/task/add-tree', taskController.addTaskTree);
router.get('/task/:id/with-subtasks', taskController.getTaskWithSubtasks);



// Rutas para Progreso
router.post('/progress/create', progressController.createProgress);
router.get('/progress/:id', progressController.getProgress);
router.put('/progress/:id/update', progressController.updateProgress);
router.delete('/progress/:id/delete', progressController.deleteProgress);
router.get('/progress/user/:id/date-range', progressController.getUserProgressByDateRange);

// Rutas de etiquetas (tags)
// router.post('/tags', tagController.createTag);
// router.get('/tags/:id', tagController.getTag);
// router.put('/tags/:id', tagController.updateTag);
// router.delete('/tags/:id', tagController.deleteTag);

// Rutas para Identidad Deseada (Opcionales por ahora)
// router.post('/identity/create', identityController.createIdentity);
// router.get('/identity/:id', identityController.getIdentity);
// router.put('/identity/:id/update', identityController.updateIdentity);
// router.delete('/identity/:id/delete', identityController.deleteIdentity);

module.exports = router;
