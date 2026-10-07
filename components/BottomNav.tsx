'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: 'HOME', icon: '🏠', href: '/home' },
    { id: 'city', label: 'CITY', icon: '🌆', href: '/city' },
    { id: 'create', label: 'CREATE', icon: '✍️', href: '/create' },
    { id: 'portfolio', label: 'PORTFOLIO', icon: '💼', href: '/portfolio' },
    { id: 'device', label: 'DEVICE', icon: '📱', href: '/device' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-purple-400 bg-slate-800/50'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
