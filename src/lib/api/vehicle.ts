import { get, post, put, del } from './base';

export interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: string | number;
  color: string;
  status: 'ACTIVE' | 'IN_SERVICE' | 'ON_SERVICE' | 'IN_MAINTENANCE' | 'ON_MAINTENANCE' | 'WITH_ISSUE' | 'CRASHED' | 'NEW' | 'active' | 'maintenance' | 'inactive';
  notes: string;
  // Additional fields that might be in the API response
  plateNumber?: string;
  make?: string;
  type?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

const vehicleService = {
  getAll: () => get<Vehicle[]>('/vehicle'),
  getById: (id: string) => get<Vehicle>(`/vehicle/${id}`),
  getByLicensePlate: (licensePlate: string) => get<Vehicle>(`/vehicle/${licensePlate}`),
  create: (data: Vehicle) => post<Vehicle>('/vehicle', data),
  update: (id: string, data: Vehicle) => put<Vehicle>(`/vehicle/${id}`, data),
  delete: (id: string) => del(`/vehicles/${id}`),
  getByStatus: (status: Vehicle['status']) => get<Vehicle[]>(`/vehicle/status/${status}`)
};

export { vehicleService };