import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { textApi } from '../services/api';

const TABS = [
  { id: 'transliterate', label: '🔤 Транслітерація' },
  { id: 'translate', label: '🌍 Переклад' },
  { id: 'normalize', label: '✨ Нормалізація' },
  { id: 'detect', label: '🔍 Визначення мови' },
];

const LANG_LABELS = { uk: 'Українська', en: 'Англійська', pl: 'Польська', de: 'Німецька', fr: 'Французька' };

export default function Home() {
  const router = useRouter();
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
    if (!text.trim()) return setError('Введіть текст');
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
      if (tab === 'detect') setResult(`Мова: ${LANG_LABELS[d.language] || d.language} (${d.language})`);
      else setResult(d.result);
    } catch (err) {
      setError(err.response?.data?.error || 'Помилка обробки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Обробка тексту</h1>
        <p className="text-gray-500 mb-6">Транслітерація, переклад та нормалізація текстових даних</p>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setResult(''); setError(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-400'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          {/* Options */}
          {tab === 'transliterate' && (
            <div className="flex gap-3">
              <button onClick={() => setDirection('uk-lat')}
                className={`px-4 py-2 rounded-lg text-sm ${direction === 'uk-lat' ? 'bg-blue-600 text-white' : 'border hover:border-blue-400'}`}>
                Укр → Лат
              </button>
              <button onClick={() => setDirection('lat-uk')}
                className={`px-4 py-2 rounded-lg text-sm ${direction === 'lat-uk' ? 'bg-blue-600 text-white' : 'border hover:border-blue-400'}`}>
                Лат → Укр
              </button>
            </div>
          )}

          {tab === 'translate' && (
            <div className="flex gap-3 flex-wrap">
              <div>
                <label className="text-xs text-gray-500 block mb-1">З мови</label>
                <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="auto">Авто</option>
                  {Object.entries(LANG_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">На мову</label>
                <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {Object.entries(LANG_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
          )}

          {tab === 'normalize' && (
            <div className="flex flex-wrap gap-3">
              {Object.entries({ lowercase: 'Нижній регістр', removeHtmlTags: 'Видалити HTML', trimWhitespace: 'Пробіли', removeSpecial: 'Спецсимволи' }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={normOptions[key]}
                    onChange={(e) => setNormOptions({ ...normOptions, [key]: e.target.checked })}
                    className="rounded" />
                  {label}
                </label>
              ))}
            </div>
          )}

          {/* Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Вхідний текст</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              rows={5} placeholder="Введіть текст для обробки..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
          </div>

          {error && <div className="bg-red-50 text-red-600 rounded p-3 text-sm">{error}</div>}

          <button onClick={process} disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
            {loading ? 'Обробка...' : 'Обробити'}
          </button>

          {/* Result */}
          {result && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Результат</label>
              <div className="bg-gray-50 border rounded-lg p-4 text-gray-800 whitespace-pre-wrap break-words">
                {result}
              </div>
              <button onClick={() => navigator.clipboard.writeText(result)}
                className="mt-2 text-xs text-blue-600 hover:underline">
                Копіювати
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
