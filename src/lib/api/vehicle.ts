import { get, post, put, del } from './base';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: string | number;
  color: string;
  status: 'AVAILABLE' | 'IN_SERVICE' | 'IN_MAINTENANCE' | 'WITH_ISSUE' | 'NEW' | 'active' | 'maintenance' | 'inactive';
  notes: string;
  // Additional fields that might be in the API response
  plateNumber?: string;
  make?: string;
  type?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

const vehicleService = {
  getAll: () => get<Vehicle[]>('/api/vehicles'),
  getById: (id: string) => get<Vehicle>(`/api/vehicles/${id}`),
  getByLicensePlate: (licensePlate: string) => get<Vehicle>(`/api/vehicles/${licensePlate}`),
  create: (data: Vehicle) => post<Vehicle>('/api/vehicles', data),
  update: (id: string, data: Vehicle) => put<Vehicle>(`/api/vehicles/${id}`, data),
  delete: (id: string) => del(`/api/vehicles/${id}`),
  getByStatus: (status: Vehicle['status']) => get<Vehicle[]>(`/api/vehicles/status/${status}`)
};

export { vehicleService };