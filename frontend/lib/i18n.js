import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Interface strings for both languages live in this file.
// For two languages and a few dozen strings a full i18n library would be overkill.

const LANG_KEY = 'lang';
export const LANGS = ['uk', 'en'];
const DEFAULT_LANG = 'uk';
const LOCALES = { uk: 'uk-UA', en: 'en-GB' };

const messages = {
  uk: {
    'nav.home': 'Головна',
    'nav.history': 'Історія',
    'nav.admin': 'Адмін',
    'nav.logout': 'Вийти',
    'nav.login': 'Вхід',
    'nav.register': 'Реєстрація',
    'common.language': 'Мова',
    'common.loading': 'Завантаження...',
    'common.prev': '← Назад',
    'common.next': 'Вперед →',

    'tab.transliterate': '🔤 Транслітерація',
    'tab.translate': '🌍 Переклад',
    'tab.normalize': '✨ Нормалізація',
    'tab.detect': '🔍 Визначення мови',

    'lang.uk': 'Українська',
    'lang.en': 'Англійська',
    'lang.pl': 'Польська',
    'lang.de': 'Німецька',
    'lang.fr': 'Французька',

    'op.transliteration': 'Транслітерація',
    'op.translation': 'Переклад',
    'op.normalization': 'Нормалізація',

    'home.title': 'Обробка тексту',
    'home.subtitle': 'Транслітерація, переклад та нормалізація текстових даних',
    'home.dirUkLat': 'Укр → Лат',
    'home.dirLatUk': 'Лат → Укр',
    'home.from': 'З мови',
    'home.to': 'На мову',
    'home.auto': 'Авто',
    'home.input': 'Вхідний текст',
    'home.placeholder': 'Введіть текст для обробки...',
    'home.enterText': 'Введіть текст',
    'home.error': 'Помилка обробки',
    'home.process': 'Обробити',
    'home.processing': 'Обробка...',
    'home.result': 'Результат',
    'home.copy': 'Копіювати',
    'home.detected': 'Мова: {name} ({code})',

    'norm.lowercase': 'Нижній регістр',
    'norm.removeHtmlTags': 'Видалити HTML',
    'norm.trimWhitespace': 'Пробіли',
    'norm.removeSpecial': 'Спецсимволи',

    'login.title': 'Вхід',
    'login.email': 'Email',
    'login.password': 'Пароль',
    'login.error': 'Помилка входу',
    'login.submit': 'Увійти',
    'login.loading': 'Вхід...',
    'login.noAccount': 'Немає акаунту?',
    'login.toRegister': 'Реєстрація',

    'register.title': 'Реєстрація',
    'register.name': "Ім'я",
    'register.passwordShort': 'Пароль мінімум 6 символів',
    'register.error': 'Помилка реєстрації',
    'register.submit': 'Зареєструватись',
    'register.loading': 'Реєстрація...',
    'register.haveAccount': 'Вже є акаунт?',
    'register.toLogin': 'Вхід',

    'history.title': 'Історія запитів',
    'history.empty': 'Історія порожня',
    'history.source': 'Вхідний текст',
    'history.result': 'Результат',

    'admin.title': 'Адмін панель',
    'admin.clearHistory': 'Очистити історію',
    'admin.confirmClear': 'Очистити всю історію?',
    'admin.cleared': 'Історію очищено',
    'admin.tabStats': '📊 Статистика',
    'admin.tabUsers': '👥 Користувачі',
    'admin.tabLogs': '📋 Логи',
    'admin.statUsers': 'Користувачів',
    'admin.statRequests': 'Запитів',
    'admin.statErrors': 'Нещодавніх помилок',
    'admin.operations': 'Операції',
    'admin.colId': 'ID',
    'admin.colName': "Ім'я",
    'admin.colEmail': 'Email',
    'admin.colRole': 'Роль',
    'admin.colStatus': 'Статус',
    'admin.colActions': 'Дії',
    'admin.blocked': 'Заблоковано',
    'admin.active': 'Активний',
    'admin.block': 'Заблокувати',
    'admin.unblock': 'Розблокувати',
    'admin.delete': 'Видалити',
    'admin.confirmDelete': 'Видалити користувача?',
    'admin.noLogs': 'Логів немає',

    // Server messages (the backend returns them in Ukrainian; here they get a translation)
    'server.emailTaken': 'Користувач з таким email вже існує',
    'server.badCredentials': 'Невірний email або пароль',
    'server.accountBlocked': 'Акаунт заблоковано',
    'server.noToken': 'Токен авторизації відсутній',
    'server.userNotFound': 'Користувача не знайдено',
    'server.invalidToken': 'Недійсний токен авторизації',
    'server.forbidden': 'Доступ заборонено. Потрібні права адміністратора.',
    'server.tooMany': 'Забагато запитів. Спробуйте пізніше.',
    'server.routeNotFound': 'Маршрут не знайдено',
    'server.targetRequired': 'Вкажіть мову перекладу (targetLang)',
    'server.emptyText': 'Текст не може бути порожнім',
    'server.translationFailed': 'Помилка перекладу. Спробуйте пізніше.',
    'server.cantBlockAdmin': 'Не можна заблокувати адміністратора',
    'server.cantDeleteAdmin': 'Не можна видалити адміністратора',
    'server.invalidRole': 'Невірна роль',
    'server.langNotSupported': 'Мова перекладу не підтримується. Доступні: {list}',
  },

  en: {
    'nav.home': 'Home',
    'nav.history': 'History',
    'nav.admin': 'Admin',
    'nav.logout': 'Log out',
    'nav.login': 'Sign in',
    'nav.register': 'Sign up',
    'common.language': 'Language',
    'common.loading': 'Loading...',
    'common.prev': '← Previous',
    'common.next': 'Next →',

    'tab.transliterate': '🔤 Transliteration',
    'tab.translate': '🌍 Translation',
    'tab.normalize': '✨ Normalization',
    'tab.detect': '🔍 Language detection',

    'lang.uk': 'Ukrainian',
    'lang.en': 'English',
    'lang.pl': 'Polish',
    'lang.de': 'German',
    'lang.fr': 'French',

    'op.transliteration': 'Transliteration',
    'op.translation': 'Translation',
    'op.normalization': 'Normalization',

    'home.title': 'Text processing',
    'home.subtitle': 'Transliteration, translation and normalization of text data',
    'home.dirUkLat': 'Ukr → Lat',
    'home.dirLatUk': 'Lat → Ukr',
    'home.from': 'From',
    'home.to': 'To',
    'home.auto': 'Auto',
    'home.input': 'Input text',
    'home.placeholder': 'Enter the text to process...',
    'home.enterText': 'Enter some text',
    'home.error': 'Processing error',
    'home.process': 'Process',
    'home.processing': 'Processing...',
    'home.result': 'Result',
    'home.copy': 'Copy',
    'home.detected': 'Language: {name} ({code})',

    'norm.lowercase': 'Lowercase',
    'norm.removeHtmlTags': 'Strip HTML',
    'norm.trimWhitespace': 'Whitespace',
    'norm.removeSpecial': 'Special characters',

    'login.title': 'Sign in',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.error': 'Sign-in failed',
    'login.submit': 'Sign in',
    'login.loading': 'Signing in...',
    'login.noAccount': "Don't have an account?",
    'login.toRegister': 'Sign up',

    'register.title': 'Sign up',
    'register.name': 'Name',
    'register.passwordShort': 'Password must be at least 6 characters',
    'register.error': 'Registration failed',
    'register.submit': 'Sign up',
    'register.loading': 'Signing up...',
    'register.haveAccount': 'Already have an account?',
    'register.toLogin': 'Sign in',

    'history.title': 'Request history',
    'history.empty': 'History is empty',
    'history.source': 'Input text',
    'history.result': 'Result',

    'admin.title': 'Admin panel',
    'admin.clearHistory': 'Clear history',
    'admin.confirmClear': 'Clear the entire history?',
    'admin.cleared': 'History cleared',
    'admin.tabStats': '📊 Statistics',
    'admin.tabUsers': '👥 Users',
    'admin.tabLogs': '📋 Logs',
    'admin.statUsers': 'Users',
    'admin.statRequests': 'Requests',
    'admin.statErrors': 'Recent errors',
    'admin.operations': 'Operations',
    'admin.colId': 'ID',
    'admin.colName': 'Name',
    'admin.colEmail': 'Email',
    'admin.colRole': 'Role',
    'admin.colStatus': 'Status',
    'admin.colActions': 'Actions',
    'admin.blocked': 'Blocked',
    'admin.active': 'Active',
    'admin.block': 'Block',
    'admin.unblock': 'Unblock',
    'admin.delete': 'Delete',
    'admin.confirmDelete': 'Delete this user?',
    'admin.noLogs': 'No logs',

    'server.emailTaken': 'A user with this email already exists',
    'server.badCredentials': 'Incorrect email or password',
    'server.accountBlocked': 'This account is blocked',
    'server.noToken': 'Authorization token is missing',
    'server.userNotFound': 'User not found',
    'server.invalidToken': 'Invalid authorization token',
    'server.forbidden': 'Access denied. Administrator rights are required.',
    'server.tooMany': 'Too many requests. Please try again later.',
    'server.routeNotFound': 'Route not found',
    'server.targetRequired': 'Specify the target language (targetLang)',
    'server.emptyText': 'Text cannot be empty',
    'server.translationFailed': 'Translation failed. Please try again later.',
    'server.cantBlockAdmin': 'An administrator cannot be blocked',
    'server.cantDeleteAdmin': 'An administrator cannot be deleted',
    'server.invalidRole': 'Invalid role',
    'server.langNotSupported': 'Target language is not supported. Available: {list}',
  },
};

function format(text, params) {
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [name, value]) => acc.split(`{${name}}`).join(String(value)),
    text
  );
}

// The backend sends error texts in Ukrainian. Known ones are mapped to keys
// here so they can be shown in the selected language; unknown ones go through as is.
const serverKeyByText = Object.fromEntries(
  Object.entries(messages.uk)
    .filter(([key]) => key.startsWith('server.') && !key.includes('{'))
    .map(([key, text]) => [text, key])
);
const LANG_NOT_SUPPORTED_PREFIX = 'Мова перекладу не підтримується. Доступні: ';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LANG);

  // Saved language is read after the first render, otherwise the server
  // and the browser would render different text (hydration warning).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && LANGS.includes(saved)) setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
  }, []);

  const value = useMemo(() => {
    const t = (key, params) => format(messages[lang][key] ?? messages[DEFAULT_LANG][key] ?? key, params);

    // Text of an Axios error: translated server message or the fallback key
    const tError = (err, fallbackKey) => {
      const text = err?.response?.data?.error;
      if (!text) return t(fallbackKey);
      if (text.startsWith(LANG_NOT_SUPPORTED_PREFIX)) {
        return t('server.langNotSupported', { list: text.slice(LANG_NOT_SUPPORTED_PREFIX.length) });
      }
      return serverKeyByText[text] ? t(serverKeyByText[text]) : text;
    };

    const formatDateTime = (d) => new Date(d).toLocaleString(LOCALES[lang]);

    return { lang, setLang, t, tError, formatDateTime };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
  return ctx;
}
