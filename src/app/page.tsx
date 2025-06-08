'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';
import {
  TruckIcon,
  UserIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { vehicleService, Vehicle } from "@/lib/api/vehicle";
import { driverService, Driver } from "@/lib/api/driver";
import { scheduleService, Schedule } from "@/lib/api/schedule";
import { clientService, Client } from "@/lib/api/client";

// Stats card component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  href 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}) {
  const { t } = useTranslation();
  
  return (
    <div className="group relative overflow-hidden bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${color.replace('text-', 'from-').replace('text-', 'to-')} bg-opacity-10 backdrop-blur-sm`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-500">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {value}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href={href}
            className={`inline-flex items-center text-sm font-medium ${color} group-hover:underline`}
          >
            {t('common.viewAll')}
            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="sr-only"> {title.toLowerCase()}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Quick action button component
const QuickAction = ({
  title,
  description,
  icon: Icon,
  color,
  textColor,
  href
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  textColor?: string;
  href: string;
}) => {
  const { t } = useTranslation();
  return (
    <Link 
      href={href}
      className={`group relative flex flex-col justify-between p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1`}
    >
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10 ${color.replace('from-', 'bg-gradient-to-br from-').replace('to-', 'to-')}`}></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${color.replace('from-', 'bg-gradient-to-br from-').replace('to-', 'to-')} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${textColor || 'text-gray-900'}`}>
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>
        <div className={`inline-flex items-center text-sm font-medium ${textColor || 'text-blue-600'} group-hover:underline`}>
          {title.includes(t('common.view')) ? t('common.viewMore') : t('common.getStarted')}
          <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    vehicles: 0,
    drivers: 0,
    schedules: 0,
    clients: 0
  });
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  
  // Load dashboard stats
  useEffect(() => {
    // Only fetch if we haven't already
    if (fetchedRef.current) return;
    
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch each resource separately with individual error handling
        let vehiclesData: Vehicle[] = [];
        let driversData: Driver[] = [];
        let schedulesData: Schedule[] = [];
        let clientsData: Client[] = [];
        
        try {
          const response = await vehicleService.getAll();
          vehiclesData = Array.isArray(response) ? response : [];
          console.log('Vehicles data loaded successfully');
        } catch (error) {
          console.error('Error loading vehicles:', error);
        }
        
        try {
          const response = await driverService.getAll();
          driversData = Array.isArray(response) ? response : [];
          console.log('Drivers data loaded successfully');
        } catch (error) {
          console.error('Error loading drivers:', error);
        }
        
        try {
          const response = await scheduleService.getAll();
          schedulesData = Array.isArray(response) ? response : [];
          console.log('Schedules data loaded successfully');
        } catch (error) {
          console.error('Error loading schedules:', error);
        }
        
        try {
          const response = await clientService.getAll();
          clientsData = Array.isArray(response) ? response : [];
          console.log('Clients data loaded successfully');
        } catch (error) {
          console.error('Error loading clients:', error);
        }
        
        // More defensive filtering with optional chaining and nullish coalescing
        setStats({
          vehicles: vehiclesData?.filter(v => v?.status === 'ACTIVE' || v?.status === 'active')?.length || 0,
          drivers: driversData?.filter(d => d?.status === 'ACTIVE')?.length || 0,
          schedules: schedulesData?.filter(s => s?.status === 'PROGRAMED')?.length || 0,
          clients: clientsData?.filter(c => c?.status === 'ACTIVE')?.length || 0
        });
        
        // Mark as fetched so we don't fetch again
        fetchedRef.current = true;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Dashboard stats with animated counters
  const dashboardStats = [
    { 
      label: t('dashboard.totalVehicles'),
      value: stats.vehicles,
      color: "text-blue-600", 
      bgColor: "from-blue-50 to-blue-100",
      icon: TruckIcon,
      href: "/vehicles"
    },
    { 
      label: t('dashboard.totalDrivers'),
      value: stats.drivers,
      color: "text-emerald-600", 
      bgColor: "from-emerald-50 to-emerald-100",
      icon: UserIcon,
      href: "/drivers"
    },
    { 
      label: t('dashboard.totalSchedules'),
      value: stats.schedules,
      color: "text-violet-600", 
      bgColor: "from-violet-50 to-violet-100",
      icon: CalendarDaysIcon,
      href: "/schedules"
    },
    { 
      label: t('dashboard.totalClients'),
      value: stats.clients,
      color: "text-amber-600", 
      bgColor: "from-amber-50 to-amber-100",
      icon: UserGroupIcon,
      href: "/clients"
    },
  ];

  const quickActions = [
    { 
      name: t('quickActions.manageClients'),
      description: t('quickActions.manageClientsDesc'),
      href: '/clients', 
      icon: UserGroupIcon,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-indigo-50"
    },
    { 
      name: t('quickActions.manageDrivers'),
      description: t('quickActions.manageDriversDesc'),
      href: '/drivers', 
      icon: UserIcon,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-50"
    },
    { 
      name: t('quickActions.scheduleTrip'),
      description: t('quickActions.scheduleTripDesc'),
      href: '/schedules/new', 
      icon: CalendarDaysIcon,
      color: "from-violet-500 to-purple-600",
      textColor: "text-violet-50"
    },
    { 
      name: t('quickActions.manageFleet'),
      description: t('quickActions.manageFleetDesc'),
      href: '/vehicles', 
      icon: TruckIcon,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-50"
    },
  ];

  return (
    <div className="h-full overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome section with time */}
        <div className="glass rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('dashboard.welcome')}
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="text-right bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100/50 w-full sm:w-auto transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-mono font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-gray-500 text-sm">
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t('dashboard.overview')}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('common.lastUpdated')}: {t('common.justNow')}</span>
              <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors" aria-label={t('common.refresh')}>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {dashboardStats.map((stat, index) => (
              <div 
                key={index} 
                className="h-full transform transition-all duration-300 hover:scale-[1.02]"
                style={{
                  animation: `fadeIn 0.5s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                  opacity: 0
                }}
              >
                <StatCard
                  title={stat.label}
                  value={loading ? '-' : stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  href={stat.href}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6 pt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{t('quickActions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="h-full transform transition-all duration-300 hover:scale-[1.02]"
                style={{
                  animation: `fadeIn 0.5s ease-out forwards`,
                  animationDelay: `${index * 100 + 400}ms`,
                  opacity: 0
                }}
              >
                <QuickAction
                  title={action.name}
                  description={action.description}
                  icon={action.icon}
                  color={action.color}
                  href={action.href}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
