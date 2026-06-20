const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const {
  getUsers, toggleBlock, deleteUser, changeRole,
  getStats, getLogs, clearHistory,
} = require('../controllers/adminController');

router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Список всіх користувачів
 *     tags: [Admin]
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   patch:
 *     summary: Заблокувати/розблокувати користувача
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.patch('/users/:id/block', toggleBlock);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Видалити користувача
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Змінити роль користувача
 *     tags: [Admin]
 */
router.patch('/users/:id/role', changeRole);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Статистика системи
 *     tags: [Admin]
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Системні логи
 *     tags: [Admin]
 */
router.get('/logs', getLogs);

/**
 * @swagger
 * /api/admin/history:
 *   delete:
 *     summary: Очистити всю історію запитів
 *     tags: [Admin]
 */
router.delete('/history', clearHistory);

module.exports = router;
