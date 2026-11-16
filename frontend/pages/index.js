import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { textApi } from '../services/api';
import { useI18n } from '../lib/i18n';

const TABS = ['transliterate', 'translate', 'normalize', 'detect'];
const LANG_CODES = ['uk', 'en', 'pl', 'de', 'fr'];
const NORM_KEYS = ['lowercase', 'removeHtmlTags', 'trimWhitespace', 'removeSpecial'];

export default function Home() {
  const router = useRouter();
  const { t, tError } = useI18n();
  const [tab, setTab] = useState('transliterate');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('uk-lat');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [normOptions, setNormOptions] = useState({ lowercase: true, removeHtmlTags: true, trimWhitespace: true, removeSpecial: false });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, []);

  const process = async () => {
    if (!text.trim()) return setError(t('home.enterText'));
    setLoading(true);
    setError('');
    setResult('');
    try {
      let res;
      if (tab === 'transliterate') res = await textApi.transliterate(text, direction);
      else if (tab === 'translate') res = await textApi.translate(text, sourceLang, targetLang);
      else if (tab === 'normalize') res = await textApi.normalize(text, normOptions);
      else if (tab === 'detect') res = await textApi.detect(text);

      const d = res.data;
      if (tab === 'detect') {
        const name = LANG_CODES.includes(d.language) ? t(`lang.${d.language}`) : d.language;
        setResult(t('home.detected', { name, code: d.language }));
      }
      else setResult(d.result);
    } catch (err) {
      setError(tError(err, 'home.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('home.title')}</h1>
        <p className="text-gray-500 mb-6">{t('home.subtitle')}</p>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((id) => (
            <button key={id} onClick={() => { setTab(id); setResult(''); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-400'}`}>
              {t(`tab.${id}`)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {/* Options */}
          {tab === 'transliterate' && (
            <div className="flex gap-3">
              <button onClick={() => setDirection('uk-lat')}
                className={`px-4 py-2 rounded-lg text-sm ${direction === 'uk-lat' ? 'bg-blue-600 text-white' : 'border hover:border-blue-400'}`}>
                {t('home.dirUkLat')}
              </button>
              <button onClick={() => setDirection('lat-uk')}
                className={`px-4 py-2 rounded-lg text-sm ${direction === 'lat-uk' ? 'bg-blue-600 text-white' : 'border hover:border-blue-400'}`}>
                {t('home.dirLatUk')}
              </button>
            </div>
          )}

          {tab === 'translate' && (
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('home.from')}</label>
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="auto">{t('home.auto')}</option>
                  {LANG_CODES.map((code) => <option key={code} value={code}>{t(`lang.${code}`)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">{t('home.to')}</label>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {LANG_CODES.map((code) => <option key={code} value={code}>{t(`lang.${code}`)}</option>)}
                </select>
              </div>
            </div>
          )}

          {tab === 'normalize' && (
            <div className="flex flex-wrap gap-3">
              {NORM_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={normOptions[key]}
                    onChange={(e) => setNormOptions({ ...normOptions, [key]: e.target.checked })}
                    className="rounded" />
                  {t(`norm.${key}`)}
                </label>
              ))}
            </div>
          )}

          {/* Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">{t('home.input')}</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              rows={5} placeholder={t('home.placeholder')}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>

          {error && <div className="bg-red-50 text-red-600 rounded p-3 text-sm">{error}</div>}

          <button onClick={process} disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {loading ? t('home.processing') : t('home.process')}
          </button>

          {/* Result */}
          {result && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t('home.result')}</label>
              <div className="bg-gray-50 border rounded-lg p-4 text-gray-800 whitespace-pre-wrap break-words">
                {result}
              </div>
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="mt-2 text-xs text-blue-600 hover:underline">
                {t('home.copy')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
