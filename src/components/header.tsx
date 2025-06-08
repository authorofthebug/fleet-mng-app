'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/use-translation';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {t('AppName')}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                {t('navigation.home')}
              </Link>
              <Link href="/vehicles" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                {t('navigation.vehicles')}
              </Link>
              <Link href="/schedule" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                {t('navigation.schedule')}
              </Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
