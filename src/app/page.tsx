'use client';

import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import {
  TruckIcon,
  UserIcon,
  BuildingOffice2Icon,
  BellAlertIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  DocumentIcon,
  UserCircleIcon,
  KeyIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import {CalendarDaysIcon} from "@heroicons/react/24/solid";

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

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Fleet Manager</h1>
            <p className="mt-2 text-gray-600">Manage your fleet operations efficiently</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">Manage {item.name.toLowerCase()} records</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
