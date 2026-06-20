const { PrismaClient } = require('@prisma/client');
const { transliterate } = require('../services/transliterationService');
const { translate, detectLanguage, SUPPORTED_LANGS } = require('../services/translationService');
const { normalize } = require('../services/normalizationService');

const prisma = new PrismaClient();

const saveRequest = async (userId, operationType, sourceText, resultText) => {
  await prisma.request.create({
    data: { userId, operationType, sourceText, resultText },
  });
};

/**
 * POST /api/text/transliterate
 */
const transliterateText = async (req, res, next) => {
  try {
    const { text, direction = 'uk-lat' } = req.body;
    const result = transliterate(text, direction);
    await saveRequest(req.user.id, 'transliteration', text, result);
    res.json({ result, direction });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/text/translate
 */
const translateText = async (req, res, next) => {
  try {
    const { text, sourceLang = 'auto', targetLang } = req.body;
    if (!targetLang) return res.status(400).json({ error: 'Вкажіть мову перекладу (targetLang)' });

    const result = await translate(text, sourceLang, targetLang);
    await saveRequest(req.user.id, 'translation', text, result);
    res.json({ result, sourceLang, targetLang });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/text/normalize
 */
const normalizeText = async (req, res, next) => {
  try {
    const { text, options = {} } = req.body;
    const result = normalize(text, options);
    await saveRequest(req.user.id, 'normalization', text, result);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/text/detect
 */
const detectLang = async (req, res, next) => {
  try {
    const { text } = req.body;
    const language = await detectLanguage(text);
    res.json({ language });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/text/history
 */
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.request.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      data: requests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/text/languages
 */
const getSupportedLanguages = (req, res) => {
  res.json({ languages: SUPPORTED_LANGS });
};

module.exports = {
  transliterateText,
  translateText,
  normalizeText,
  detectLang,
  getHistory,
  getSupportedLanguages,
};
