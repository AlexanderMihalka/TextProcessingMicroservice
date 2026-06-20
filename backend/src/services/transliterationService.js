// Ukrainian <-> Latin transliteration table (KMU 2010 standard)
const ukToLatMap = {
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'H', 'Ґ': 'G',
  'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh', 'З': 'Z',
  'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K',
  'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P',
  'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F',
  'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ь': '', 'Ю': 'Yu', 'Я': 'Ya',
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g',
  'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
  'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k',
  'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
  'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
  'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ь': '', 'ю': 'yu', 'я': 'ya',
  "'": '', '\u2019': '',
};

const latToUkMap = {
  'shch': 'щ', 'Shch': 'Щ', 'SHCH': 'Щ',
  'zh': 'ж', 'Zh': 'Ж', 'ZH': 'Ж',
  'ts': 'ц', 'Ts': 'Ц', 'TS': 'Ц',
  'ch': 'ч', 'Ch': 'Ч', 'CH': 'Ч',
  'sh': 'ш', 'Sh': 'Ш', 'SH': 'Ш',
  'kh': 'х', 'Kh': 'Х', 'KH': 'Х',
  'ye': 'є', 'Ye': 'Є', 'YE': 'Є',
  'yi': 'ї', 'Yi': 'Ї', 'YI': 'Ї',
  'yu': 'ю', 'Yu': 'Ю', 'YU': 'Ю',
  'ya': 'я', 'Ya': 'Я', 'YA': 'Я',
  'a': 'а', 'A': 'А', 'b': 'б', 'B': 'Б',
  'v': 'в', 'V': 'В', 'h': 'г', 'H': 'Г',
  'g': 'ґ', 'G': 'Ґ', 'd': 'д', 'D': 'Д',
  'e': 'е', 'E': 'Е', 'z': 'з', 'Z': 'З',
  'y': 'и', 'Y': 'И', 'i': 'і', 'I': 'І',
  'k': 'к', 'K': 'К', 'l': 'л', 'L': 'Л',
  'm': 'м', 'M': 'М', 'n': 'н', 'N': 'Н',
  'o': 'о', 'O': 'О', 'p': 'п', 'P': 'П',
  'r': 'р', 'R': 'Р', 's': 'с', 'S': 'С',
  't': 'т', 'T': 'Т', 'u': 'у', 'U': 'У',
  'f': 'ф', 'F': 'Ф',
};

/**
 * Transliterate Ukrainian text to Latin
 */
function ukToLat(text) {
  return text.split('').map(char => {
    return ukToLatMap.hasOwnProperty(char) ? ukToLatMap[char] : char;
  }).join('');
}

/**
 * Transliterate Latin text to Ukrainian (best-effort)
 */
function latToUk(text) {
  let result = text;
  // Multi-char sequences first
  const multiChar = ['shch', 'Shch', 'SHCH', 'zh', 'Zh', 'ZH', 'ts', 'Ts', 'TS',
    'ch', 'Ch', 'CH', 'sh', 'Sh', 'SH', 'kh', 'Kh', 'KH',
    'ye', 'Ye', 'YE', 'yi', 'Yi', 'YI', 'yu', 'Yu', 'YU', 'ya', 'Ya', 'YA'];
  for (const seq of multiChar) {
    result = result.split(seq).join(latToUkMap[seq] || seq);
  }
  // Single chars
  result = result.split('').map(char => {
    return latToUkMap.hasOwnProperty(char) ? latToUkMap[char] : char;
  }).join('');
  return result;
}

/**
 * Main transliteration function
 * @param {string} text
 * @param {string} direction - 'uk-lat' or 'lat-uk'
 */
function transliterate(text, direction = 'uk-lat') {
  if (!text || typeof text !== 'string') throw new Error('Текст не може бути порожнім');
  if (direction === 'uk-lat') return ukToLat(text);
  if (direction === 'lat-uk') return latToUk(text);
  throw new Error('Невірний напрямок транслітерації. Використовуйте: uk-lat або lat-uk');
}

module.exports = { transliterate };
