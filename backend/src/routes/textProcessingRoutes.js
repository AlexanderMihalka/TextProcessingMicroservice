const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  transliterateText, translateText, normalizeText,
  detectLang, getHistory, getSupportedLanguages,
} = require('../controllers/textProcessingController');

router.use(authMiddleware);

/**
 * @swagger
 * /api/text/transliterate:
 *   post:
 *     summary: Транслітерація тексту
 *     tags: [Text Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string, example: "Привіт світ" }
 *               direction: { type: string, enum: [uk-lat, lat-uk], default: uk-lat }
 *     responses:
 *       200:
 *         description: Транслітерований текст
 */
router.post('/transliterate', transliterateText);

/**
 * @swagger
 * /api/text/translate:
 *   post:
 *     summary: Переклад тексту
 *     tags: [Text Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text, targetLang]
 *             properties:
 *               text: { type: string }
 *               sourceLang: { type: string, default: auto }
 *               targetLang: { type: string, enum: [uk, en, pl, de, fr] }
 *     responses:
 *       200:
 *         description: Перекладений текст
 */
router.post('/translate', translateText);

/**
 * @swagger
 * /api/text/normalize:
 *   post:
 *     summary: Нормалізація тексту
 *     tags: [Text Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *               options:
 *                 type: object
 *                 properties:
 *                   lowercase: { type: boolean, default: true }
 *                   removeHtmlTags: { type: boolean, default: true }
 *                   trimWhitespace: { type: boolean, default: true }
 *                   removeSpecial: { type: boolean, default: false }
 *     responses:
 *       200:
 *         description: Нормалізований текст
 */
router.post('/normalize', normalizeText);

/**
 * @swagger
 * /api/text/detect:
 *   post:
 *     summary: Визначення мови тексту
 *     tags: [Text Processing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text: { type: string }
 *     responses:
 *       200:
 *         description: Визначена мова
 */
router.post('/detect', detectLang);

/**
 * @swagger
 * /api/text/history:
 *   get:
 *     summary: Історія запитів користувача
 *     tags: [Text Processing]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Список запитів
 */
router.get('/history', getHistory);

/**
 * @swagger
 * /api/text/languages:
 *   get:
 *     summary: Список підтримуваних мов
 *     tags: [Text Processing]
 *     responses:
 *       200:
 *         description: Список мов
 */
router.get('/languages', getSupportedLanguages);

module.exports = router;
