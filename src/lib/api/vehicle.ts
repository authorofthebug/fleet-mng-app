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
  plateNumber: string;
  make: string;
  createdAt: string | null;
  updatedAt: string | null;
}

const vehicleService = {
  // Get all vehicles
  getAll: () => get<Vehicle[]>('vehicle'),
  
  // Get a specific vehicle by ID (MongoDB ObjectId)
  getById: (id: string) => get<Vehicle>(`/vehicle/${id}`),
  
  // Create a new vehicle
  create: (data: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => 
    post<Vehicle>('vehicle', data),
  
  // Update an existing vehicle
  update: (id: string, data: Partial<Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>>) => 
    put<Vehicle>(`/vehicle/${id}`, data),
  
  // Delete a vehicle
  delete: (id: string) => del(`/vehicle/${id}`)
};

export { vehicleService };