import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { adminApi } from '../../services/api';

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'ADMIN') { router.push('/'); return; }
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'stats') {
        const res = await adminApi.stats();
        setStats(res.data);
      } else if (tab === 'users') {
        const res = await adminApi.users();
        setUsers(res.data.users);
      } else if (tab === 'logs') {
        const res = await adminApi.logs();
        setLogs(res.data.data);
      }
    } catch { router.push('/'); }
    finally { setLoading(false); }
  };

  const handleToggleBlock = async (id) => {
    await adminApi.toggleBlock(id);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Видалити користувача?')) return;
    await adminApi.deleteUser(id);
    loadData();
  };

  const handleClearHistory = async () => {
    if (!confirm('Очистити всю історію?')) return;
    await adminApi.clearHistory();
    alert('Історію очищено');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Адмін панель</h1>
          <button onClick={handleClearHistory} className="text-sm text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50">
            Очистити історію
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[['stats', '📊 Статистика'], ['users', '👥 Користувачі'], ['logs', '📋 Логи']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === id ? 'bg-blue-600 text-white' : 'bg-white border hover:border-blue-400'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-12 text-gray-400">Завантаження...</div>}

        {/* Stats */}
        {!loading && tab === 'stats' && stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-gray-500 mt-1">Користувачів</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-4xl font-bold text-green-600">{stats.totalRequests}</p>
                <p className="text-gray-500 mt-1">Запитів</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <p className="text-4xl font-bold text-purple-600">{stats.recentErrors?.length || 0}</p>
                <p className="text-gray-500 mt-1">Нещодавніх помилок</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Операції</h2>
              {Object.entries(stats.operationStats || {}).map(([op, count]) => (
                <div key={op} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-gray-600 capitalize">{op}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {!loading && tab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', "Ім'я", 'Email', 'Роль', 'Статус', 'Дії'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{u.id}</td>
                    <td className="px-4 py-3">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {u.isBlocked ? 'Заблоковано' : 'Активний'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== 'ADMIN' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleToggleBlock(u.id)}
                            className="text-xs text-blue-600 hover:underline">
                            {u.isBlocked ? 'Розблокувати' : 'Заблокувати'}
                          </button>
                          <button onClick={() => handleDelete(u.id)}
                            className="text-xs text-red-500 hover:underline">
                            Видалити
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Logs */}
        {!loading && tab === 'logs' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="px-4 py-3 flex gap-3 items-start">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono mt-0.5 ${
                    log.level === 'error' ? 'bg-red-100 text-red-600' :
                    log.level === 'warn' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'}`}>
                    {log.level}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">{log.message}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('uk-UA')}
                  </span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-center py-12 text-gray-400">Логів немає</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
