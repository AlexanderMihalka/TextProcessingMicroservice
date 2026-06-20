import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { textApi } from '../services/api';

const OP_LABELS = { transliteration: 'Транслітерація', translation: 'Переклад', normalization: 'Нормалізація' };
const OP_COLORS = { transliteration: 'bg-blue-100 text-blue-700', translation: 'bg-green-100 text-green-700', normalization: 'bg-purple-100 text-purple-700' };

export default function History() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    loadHistory();
  }, [page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await textApi.history(page);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('uk-UA');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Історія запитів</h1>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Завантаження...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Історія порожня</div>
        ) : (
          <div className="space-y-3">
            {data.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${OP_COLORS[item.operationType] || 'bg-gray-100 text-gray-600'}`}>
                    {OP_LABELS[item.operationType] || item.operationType}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Вхідний текст</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 break-words">{item.sourceText}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Результат</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 break-words">{item.resultText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-blue-400">
              ← Назад
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              {page} / {pagination.pages}
            </span>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-blue-400">
              Вперед →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
