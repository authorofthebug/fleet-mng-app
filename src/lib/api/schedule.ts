import { get, post, put, del } from './base';

export interface Schedule {
  id: string;
  description: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PROGRAMED' | 'ALMOST_ON_ARRIVAL' | 'STARTED' | 'ON_CLIENT' | 'BACK_FROM_CLIENT' | string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  vehicleId: string;
  driverId?: string;
  origin: string;
  plate: string;
  zone: string;
  destination: string;
  startTime: string;
  endTime: string;
  // Additional fields from ProgramacionTab
  startDate?: string;
  endDate?: string;
  days?: number;
  client?: string;
  serviceType?: string;
  condition?: string;
}

const scheduleService = {
  getAll: async () => get<Schedule[]>('/schedule'),
  getById: async (id: string) => get<Schedule>(`/schedule/${id}`),
  create: async (data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => post<Schedule>('/schedule', data),
  update: async (id: string, data: Partial<Schedule>) => put<Schedule>(`/schedule/${id}`, data),
  delete: async (id: string) => del(`/schedule/${id}`)
};

export { scheduleService };
