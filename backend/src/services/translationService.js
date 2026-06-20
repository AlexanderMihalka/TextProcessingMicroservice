const axios = require('axios');
const logger = require('../utils/logger');

const LIBRE_TRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'http://libretranslate:5000';

const SUPPORTED_LANGS = ['uk', 'en', 'pl', 'de', 'fr'];

/**
 * Detect language of text via LibreTranslate
 */
async function detectLanguage(text) {
  try {
    const response = await axios.post(`${LIBRE_TRANSLATE_URL}/detect`, {
      q: text,
    });
    const result = response.data;
    if (result && result.length > 0) {
      return result[0].language;
    }
    return 'en';
  } catch (error) {
    logger.warn('Language detection failed, defaulting to en:', error.message);
    return 'en';
  }
}

/**
 * Translate text using LibreTranslate
 */
async function translate(text, sourceLang, targetLang) {
  if (!text || typeof text !== 'string') throw new Error('Текст не може бути порожнім');
  if (!SUPPORTED_LANGS.includes(targetLang)) {
    throw new Error(`Мова перекладу не підтримується. Доступні: ${SUPPORTED_LANGS.join(', ')}`);
  }

  const source = sourceLang === 'auto' ? 'auto' : sourceLang;

  try {
    const response = await axios.post(`${LIBRE_TRANSLATE_URL}/translate`, {
      q: text,
      source,
      target: targetLang,
      format: 'text',
    });
    return response.data.translatedText;
  } catch (error) {
    logger.error('Translation error:', error.message);
    throw new Error('Помилка перекладу. Спробуйте пізніше.');
  }
}

module.exports = { translate, detectLanguage, SUPPORTED_LANGS };
