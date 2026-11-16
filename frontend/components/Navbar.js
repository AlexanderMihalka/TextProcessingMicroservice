import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import LangSwitch from './LangSwitch';

export default function Navbar() {
  const router = useRouter();
  const { t } = useI18n();
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
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="text-xl font-bold hover:text-blue-200 transition">
          TextProcessing
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm">
          <LangSwitch variant="dark" />
          {user ? (
            <>
              <Link href="/" className="hover:text-blue-200">{t('nav.home')}</Link>
              <Link href="/history" className="hover:text-blue-200">{t('nav.history')}</Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-blue-200 font-semibold">{t('nav.admin')}</Link>
              )}
              <span className="text-blue-200 hidden sm:inline">{user.name}</span>
              <button onClick={logout} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded">
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">{t('nav.login')}</Link>
              <Link href="/register" className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100">
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
