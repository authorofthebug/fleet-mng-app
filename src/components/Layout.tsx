import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Fleet Manager
          </Link>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={`${isActive('/dashboard')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Dashboard
            </Link>
            <Link
              href="/vehicle"
              className={`${isActive('/vehicle')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Vehicles
            </Link>
            <Link
              href="/employee"
              className={`${isActive('/employee')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Employees
            </Link>
            <Link
              href="/contract"
              className={`${isActive('/contract')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Contracts
            </Link>
            <Link
              href="/client"
              className={`${isActive('/client')} group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
            >
              Clients
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="h-16 bg-white shadow-sm flex items-center justify-end px-6">
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 