'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
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
import {vehicleService, Vehicle} from "@/lib/api/vehicle";
import {driverService, Driver} from "@/lib/api/driver";
import {scheduleService, Schedule} from "@/lib/api/schedule";
import {clientService, Client} from "@/lib/api/client";



export default function HomePage() {
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
      label: "Active Vehicles", 
      value: stats.vehicles,
      color: "text-blue-600", 
      bgColor: "from-blue-50 to-blue-100",
      icon: TruckIcon 
    },
    { 
      label: "Available Drivers", 
      value: stats.drivers,
      color: "text-emerald-600", 
      bgColor: "from-emerald-50 to-emerald-100",
      icon: UserIcon 
    },
    { 
      label: "Scheduled Trips", 
      value: stats.schedules,
      color: "text-violet-600", 
      bgColor: "from-violet-50 to-violet-100",
      icon: CalendarDaysIcon 
    },
    { 
      label: "Active Clients", 
      value: stats.clients,
      color: "text-amber-600", 
      bgColor: "from-amber-50 to-amber-100",
      icon: UserGroupIcon 
    },
  ];

  const quickActions = [
    { 
      name: 'Client Management', 
      description: 'Add, edit, and manage client accounts',
      href: '/client', 
      icon: UserGroupIcon,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-indigo-50"
    },
    { 
      name: 'Driver Scheduling', 
      description: 'Assign and manage driver schedule',
      href: '/driver', 
      icon: UserIcon,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-50"
    },
    { 
      name: 'Trip Planning', 
      description: 'Create and manage trip schedule',
      href: '/schedule', 
      icon: CalendarDaysIcon,
      color: "from-violet-500 to-purple-600",
      textColor: "text-violet-50"
    },
    { 
      name: 'Fleet Overview', 
      description: 'Monitor and manage your vehicle fleet',
      href: '/vehicle', 
      icon: TruckIcon,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-50"
    },
  ];

  // Static counter component (no animation)
  function AnimatedCounter({ value }: { value: number }) {
    return <>{value}</>;
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome section with time */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Welcome to Fleet Manager</h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Your comprehensive solution for efficient fleet operations management
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-blue-200">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <ChartBarIcon className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-sm text-blue-100">Fleet Analytics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <BellAlertIcon className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-sm text-blue-100">Alerts Center</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-sm text-blue-100">Performance</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <CalendarDaysIcon className="h-6 w-6 text-blue-200" />
              <p className="mt-2 text-sm text-blue-100">Schedule</p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton for stats
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            dashboardStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className={`p-4 rounded-lg bg-gradient-to-br ${stat.bgColor} mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-gray-500 font-medium">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-1`}>
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color.replace('text', 'bg')} rounded-full w-3/4`}></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="group relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color}`}></div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative p-6 flex flex-col h-full">
                  <div className="bg-white/20 rounded-full p-3 w-fit backdrop-blur-sm">
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`mt-4 text-xl font-bold ${action.textColor}`}>
                    {action.name}
                  </h3>
                  <p className={`mt-2 ${action.textColor} opacity-80 text-sm`}>
                    {action.description}
                  </p>
                  <div className={`mt-auto pt-4 flex items-center ${action.textColor} text-sm font-medium`}>
                    <span>Get started</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}