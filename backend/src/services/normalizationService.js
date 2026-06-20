/**
 * Text normalization service
 */

/**
 * Remove HTML tags
 */
function removeHtml(text) {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Remove extra whitespace
 */
function normalizeWhitespace(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Remove special characters (keep letters, digits, basic punctuation)
 */
function removeSpecialChars(text) {
  return text.replace(/[^\w\s\u0400-\u04FF.,!?;:'"-]/g, '');
}

/**
 * Normalize unicode characters
 */
function normalizeUnicode(text) {
  return text.normalize('NFC');
}

/**
 * Main normalization function
 * @param {string} text
 * @param {object} options
 */
function normalize(text, options = {}) {
  if (!text || typeof text !== 'string') throw new Error('Текст не може бути порожнім');

  const {
    lowercase = true,
    removeHtmlTags = true,
    trimWhitespace = true,
    removeSpecial = false,
    unicode = true,
  } = options;

  let result = text;

  if (unicode) result = normalizeUnicode(result);
  if (removeHtmlTags) result = removeHtml(result);
  if (trimWhitespace) result = normalizeWhitespace(result);
  if (removeSpecial) result = removeSpecialChars(result);
  if (lowercase) result = result.toLowerCase();

  return result;
}

module.exports = { normalize };
