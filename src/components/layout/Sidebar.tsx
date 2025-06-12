'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserGroupIcon,
  UserIcon,
  DocumentIcon,
  CalendarDaysIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }> | ((props: { className?: string }) => ReactNode);
  className?: string;
}

const menuItems: MenuItem[] = [
  { 
    name: 'Inicio', 
    href: '/', 
    icon: (props: { className?: string }) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ) 
  },
  { name: 'Clientes', href: '/client', icon: UserGroupIcon },
  { name: 'Conductores', href: '/driver', icon: UserIcon },
  { name: 'Vehículos', href: '/vehicle', icon: TruckIcon },
  { name: 'Programación', href: '/schedule', icon: CalendarDaysIcon },
  { name: 'Catálogo', href: '/generic-types', icon: DocumentIcon },

];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathnameRaw = usePathname();
  const pathname = pathnameRaw || '/';
  
  // Add useSidebarWidth hook to update CSS variable
  useSidebarWidth();
  
  // Check if a menu item is active
  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div 
      className={`bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      } shadow-2xl relative overflow-hidden`}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20 blur-xl"></div>
        <div className="absolute -left-20 top-1/3 w-60 h-60 rounded-full bg-blue-300/20 blur-xl"></div>
        <div className="absolute right-0 bottom-20 w-32 h-32 rounded-full bg-indigo-300/20 blur-xl"></div>
      </div>
      
      <div className="p-5 flex items-center justify-between relative z-10">
        <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-blue-500/30 hover:bg-blue-400/50 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group"
        >
          {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          ) : (
              <ChevronLeftIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
        {!isCollapsed && (
            <TruckIcon className="h-8 w-8 text-white" />
        )}
      </div>
      
      <nav className="mt-6 px-2 relative z-10">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const IconComponent = item.icon;
          const iconProps = { className: `h-6 w-6 transition-all duration-300 ${
            active 
              ? 'text-white drop-shadow-glow' 
              : 'text-blue-200 group-hover:text-white group-hover:scale-110'
          }` };
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 my-1 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg' 
                  : 'hover:bg-blue-600/30 text-blue-100'
              } ${item.className || ''}`}
            >
              <div className={`relative ${active ? 'animate-pulse' : ''}`}>
                {active && (
                  <span className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-ping opacity-75"></span>
                )}
                <IconComponent {...iconProps} />
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex flex-col">
                  <span className={`font-medium transition-all duration-200 ${
                    active ? 'text-lg' : 'text-base group-hover:translate-x-1'
                  }`}>
                    {item.name}
                  </span>
                </div>
              )}
              {active && !isCollapsed && (
                <div className="ml-auto">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom decorative shape */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/50 to-transparent z-0"></div>
    </div>
  );
} 
