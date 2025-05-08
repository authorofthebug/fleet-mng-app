import { get, post, put, del } from './base';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

const clientService = {
  getAll: () => get<Client[]>('/api/clients'),
  getById: (id: string) => get<Client>(`/api/clients/${id}`),
  create: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => post<Client>('/api/clients', data),
  update: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>) =>
    put<Client>(`/api/clients/${id}`, data),
  delete: (id: string) => del(`/api/clients/${id}`),
  getByStatus: (status: Client['status']) => get<Client[]>(`/api/clients/status/${status}`)
};

export { clientService };