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
  { name: 'Agency', href: '/agency', icon: BuildingOffice2Icon },
  { name: 'Alert', href: '/alert', icon: BellAlertIcon },
  { name: 'Certification', href: '/certification', icon: ClipboardDocumentCheckIcon },
  { name: 'Checklist', href: '/checklist', icon: ClipboardDocumentListIcon },
  { name: 'Client', href: '/client', icon: UserGroupIcon },
  { name: 'Company', href: '/company', icon: BuildingLibraryIcon },
  { name: 'Contract', href: '/contract', icon: DocumentTextIcon },
  { name: 'Driver', href: '/driver', icon: UserIcon },
  { name: 'Employee', href: '/employee', icon: BriefcaseIcon },
  { name: 'Insurance', href: '/insurance', icon: ShieldCheckIcon },
  { name: 'Maintenance', href: '/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Permit', href: '/permit', icon: DocumentIcon },
  { name: 'Position', href: '/position', icon: UserCircleIcon },
  { name: 'Role', href: '/role', icon: KeyIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarDaysIcon },
  { name: 'Tariff', href: '/tariff', icon: CurrencyDollarIcon },
  { name: 'Vehicle', href: '/vehicle', icon: TruckIcon },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div 
      className={`bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Fleet Manager
          </h1>
        )}
      </div>
      
      <nav className="mt-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-lg' 
                  : 'hover:bg-blue-700/50 text-blue-100'
              }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? 'text-blue-200' : 'text-blue-100'}`} />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 