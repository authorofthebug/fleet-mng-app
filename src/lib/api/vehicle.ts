import { get, post, put, del } from './base';

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  status: 'active' | 'maintenance' | 'inactive';
  type: string;
  make: string;
  plateNumber: string;
  year: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const vehicleService = {
  getAll: () => get<Vehicle[]>('/api/vehicles'),
  getById: (id: number) => get<Vehicle>(`/api/vehicles/${id}`),
  create: (data: Omit<Vehicle, 'id'>) => post<Vehicle>('/api/vehicles', data),
  update: (id: number, data: Omit<Vehicle, 'id'>) => put<Vehicle>(`/api/vehicles/${id}`, data),
  delete: (id: number) => del(`/api/vehicles/${id}`),
  getByStatus: (status: Vehicle['status']) => get<Vehicle[]>(`/api/vehicles/status/${status}`)
};

export { vehicleService }; 