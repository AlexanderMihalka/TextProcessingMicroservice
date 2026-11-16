import { LANGS, useI18n } from '../lib/i18n';

// Small UK | EN switch. "dark" is for the blue navbar, "light" for the login pages.
export default function LangSwitch({ variant = 'light' }) {
  const { lang, setLang, t } = useI18n();
  const dark = variant === 'dark';

  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className={`inline-flex rounded-lg p-0.5 text-xs font-semibold uppercase ${
        dark ? 'bg-blue-800' : 'bg-white border'
      }`}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={`px-2.5 py-1 rounded-md transition ${
              active
                ? dark ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                : dark ? 'text-blue-200 hover:text-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
