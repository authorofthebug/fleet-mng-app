'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

type ScheduleStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface Schedule {
  id: string;
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  clientId: string;
  vehicleId: string;
  driverId: string;
  parameterId: string;
  status: ScheduleStatus;
  notes?: string;
  plate?: string;
  zone?: string;
  destination?: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  id: string;
  plate: string;
  model?: string;
  year?: number;
}

interface Driver {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

interface Parameter {
  id: string;
  name: string;
  value: string;
}

// Mock services
const scheduleService = {
  getAll: async (): Promise<Schedule[]> => {
    // Mock data
    return [
      {
        id: '1',
        title: 'Meeting with Client',
        startDate: new Date(),
        endDate: new Date(),
        clientId: '1',
        vehicleId: '1',
        driverId: '1',
        parameterId: '1',
        status: 'PENDING',
        notes: 'Initial meeting',
        plate: 'ABC123',
        zone: 'North',
        destination: 'Client Office'
      }
    ];
  },
  create: async (data: Omit<Schedule, 'id'>): Promise<Schedule> => ({
    id: Math.random().toString(36).substr(2, 9),
    ...data
  }),
  update: async (id: string, data: Partial<Schedule>): Promise<Schedule> => ({
    id,
    title: 'Updated',
    startDate: new Date(),
    endDate: new Date(),
    clientId: '',
    vehicleId: '',
    driverId: '',
    parameterId: '',
    status: 'PENDING',
    ...data
  }),
  delete: async (id: string): Promise<void> => {}
};

const clientService = {
  getAll: async (): Promise<Client[]> => [
    { id: '1', name: 'Acme Corp', email: 'acme@example.com', phone: '123-456-7890' }
  ]
};

const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => [
    { id: '1', plate: 'ABC123', model: 'Toyota Camry', year: 2020 }
  ]
};

const driverService = {
  getAll: async (): Promise<Driver[]> => [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '555-123-4567',
      firstName: 'John',
      lastName: 'Doe'
    }
  ]
};

const parameterService = {
  getAll: async (): Promise<Parameter[]> => [
    { id: '1', name: 'priority', value: 'high' }
  ]
};

// Helper function to get status color
function getStatusColor(status: ScheduleStatus): string {
  const colors: Record<ScheduleStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-500 text-white',
    CANCELLED: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [schedulesData, clientsData, vehiclesData, driversData, parametersData] = await Promise.all([
          scheduleService.getAll(),
          clientService.getAll(),
          vehicleService.getAll(),
          driverService.getAll(),
          parameterService.getAll()
        ]);

        setSchedules(schedulesData);
        setClients(clientsData);
        setVehicles(vehiclesData);
        setDrivers(driversData);
        setParameters(parametersData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get days for the current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Navigate between months
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => addDays(prev, direction === 'prev' ? -30 : 30));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          onClick={() => {}}
        >
          <span>+</span> Add Schedule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => navigateMonth('prev')}
          >
            <span className="text-xl">‹</span>
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button 
            className="p-2 hover:bg-gray-100 rounded"
            onClick={() => navigateMonth('next')}
          >
            <span className="text-xl">›</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold py-2 text-sm">
              {day}
            </div>
          ))}
          
          {daysInMonth.map((day, i) => {
            const daySchedules = schedules.filter(schedule => {
              const scheduleDate = new Date(schedule.startDate);
              return isSameDay(scheduleDate, day);
            });

            return (
              <div
                key={i}
                className={`min-h-24 p-2 border ${
                  isSameMonth(day, currentMonth) 
                    ? 'bg-white hover:bg-gray-50 cursor-pointer' 
                    : 'bg-gray-50 text-gray-400'
                } ${
                  selectedDate && isSameDay(day, selectedDate) 
                    ? 'ring-2 ring-blue-500' 
                    : ''
                }`}
                onClick={() => handleDateSelect(day)}
              >
                <div className="text-right">{format(day, 'd')}</div>
                <div className="mt-1 space-y-1">
                  {daySchedules.slice(0, 2).map(schedule => (
                    <div
                      key={schedule.id}
                      className={`text-xs p-1 rounded truncate ${getStatusColor(schedule.status)}`}
                      title={schedule.title}
                    >
                      {schedule.title}
                    </div>
                  ))}
                  {daySchedules.length > 2 && (
                    <div className="text-xs text-gray-500">+{daySchedules.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
