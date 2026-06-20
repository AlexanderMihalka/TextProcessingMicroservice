import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-blue-200 transition">
          TextProcessing
        </Link>
        <div className="flex gap-4 items-center text-sm">
          {user ? (
            <>
              <Link href="/" className="hover:text-blue-200">Головна</Link>
              <Link href="/history" className="hover:text-blue-200">Історія</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-blue-200 font-semibold">Адмін</Link>
              )}
              <span className="text-blue-200">{user.name}</span>
              <button onClick={logout} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">Вхід</Link>
              <Link href="/register" className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100">
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
