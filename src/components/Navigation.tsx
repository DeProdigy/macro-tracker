'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/add', label: 'Add Food', icon: '➕' },
    { href: '/log', label: 'Food Log', icon: '📝' },
  ];

  return (
    <nav className="bg-blue-900 shadow-md border-b border-blue-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-white">
            MacroTracker
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${pathname === item.href
                      ? 'bg-amber-500 text-blue-950 shadow-md font-semibold'
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-blue-700">
                <span className="text-sm text-blue-100">
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-blue-100 hover:text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;