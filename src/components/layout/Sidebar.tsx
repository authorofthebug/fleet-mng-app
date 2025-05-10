'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BuildingOffice2Icon, 
  BellAlertIcon, 
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  UserIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  DocumentIcon,
  UserCircleIcon,
  KeyIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  //{ name: 'Agency', href: '/agency', icon: BuildingOffice2Icon },
  //{ name: 'Alert', href: '/alert', icon: BellAlertIcon },
  //{ name: 'Certification', href: '/certification', icon: ClipboardDocumentCheckIcon },
  //{ name: 'Checklist', href: '/checklist', icon: ClipboardDocumentListIcon },
  { name: 'Client', href: '/client', icon: UserGroupIcon },
  //{ name: 'Company', href: '/company', icon: BuildingLibraryIcon },
  //{ name: 'Contract', href: '/contract', icon: DocumentTextIcon },
  { name: 'Driver', href: '/driver', icon: UserIcon },
  //{ name: 'Employee', href: '/employee', icon: BriefcaseIcon },
  //{ name: 'Insurance', href: '/insurance', icon: ShieldCheckIcon },
  //{ name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
  //{ name: 'Permit', href: '/permit', icon: DocumentIcon },
  //{ name: 'Position', href: '/position', icon: UserCircleIcon },
  //{ name: 'Role', href: '/role', icon: KeyIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarDaysIcon },
  //{ name: 'Tariff', href: '/tariff', icon: CurrencyDollarIcon },
  { name: 'Vehicle', href: '/vehicle', icon: TruckIcon },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Add useSidebarWidth hook to update CSS variable
  const { useSidebarWidth } = require('@/hooks/useSidebarWidth');
  useSidebarWidth();

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
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
            Fleet<span className="text-white">Manager</span>
          </h1>
        )}
      </div>
      
      <nav className="mt-6 px-2 relative z-10">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-3 my-1 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white shadow-lg' 
                  : 'hover:bg-blue-600/30 text-blue-100'
              }`}
            >
              <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/20 blur-sm animate-ping opacity-75"></span>
                )}
                <item.icon className={`h-6 w-6 transition-all duration-300 ${
                  isActive 
                    ? 'text-white drop-shadow-glow' 
                    : 'text-blue-200 group-hover:text-white group-hover:scale-110'
                }`} />
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex flex-col">
                  <span className={`font-medium transition-all duration-200 ${
                    isActive ? 'text-lg' : 'text-base group-hover:translate-x-1'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="text-xs text-blue-200 opacity-80">Active</span>
                  )}
                </div>
              )}
              {isActive && !isCollapsed && (
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