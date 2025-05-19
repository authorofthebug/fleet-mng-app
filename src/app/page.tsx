'use client';

import { useState, useEffect } from 'react';
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
import {vehicleService} from "@/lib/api/vehicle";
import {driverService} from "@/lib/api/driver";
import {scheduleService} from "@/lib/api/schedule";
import {clientService} from "@/lib/api/client";



const availableVehicles = async ()=>{

  const response = await vehicleService.getAll();
  return response.filter(v => v.status === 'ACTIVE' || v.status === 'active').length;
};
const availableDrivers = async ()=>{
  const response = await driverService.getAll();
  return response.filter(d => d.status === 'ACTIVE').length;
};
const scheduledTrips = async ()=>{
  const response = await scheduleService.getAll();
  return response.filter(s => s.status === 'PROGRAMED').length;
};
const activeClients = async ()=>{
  const response = await clientService.getAll();
  return response.filter(c => c.status === 'ACTIVE').length;
};

 const [vehicles, drivers, schedules, clients] = await Promise.all([
  availableVehicles(),
  availableDrivers(),
  scheduledTrips(),
  activeClients(),
]);

// Dashboard stats with animated counters
const dashboardStats = [
  { 
    label: "Active Vehicles", 
    value: vehicles,
    color: "text-blue-600", 
    bgColor: "from-blue-50 to-blue-100",
    icon: TruckIcon 
  },
  { 
    label: "Available Drivers", 
    value: drivers,
    color: "text-emerald-600", 
    bgColor: "from-emerald-50 to-emerald-100",
    icon: UserIcon 
  },
  { 
    label: "Scheduled Trips", 
    value: schedules,
    color: "text-violet-600", 
    bgColor: "from-violet-50 to-violet-100",
    icon: CalendarDaysIcon 
  },
  { 
    label: "Active Clients", 
    value: clients,
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

// Animated counter component
function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1500; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(value * progress);
      
      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(value);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  return <>{count}</>;
}

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
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
          {dashboardStats.map((stat) => (
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
          ))}
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