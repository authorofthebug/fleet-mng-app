import { get, post, put, del } from './base';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

const roleService = {
  getAll: () => get<Role[]>('/api/roles'),
  getById: (id: number) => get<Role>(`/api/roles/${id}`),
  create: (data: Omit<Role, 'id'>) => post<Role>('/api/roles', data),
  update: (id: number, data: Omit<Role, 'id'>) => put<Role>(`/api/roles/${id}`, data),
  delete: (id: number) => del(`/api/roles/${id}`)
};

export { roleService }; 