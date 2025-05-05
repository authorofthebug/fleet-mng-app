import { get, post, put, del } from './base';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyId: number;
  positionId: number;
  roleId: number;
}

const employeeService = {
  getAll: () => get<Employee[]>('/api/employees'),
  getById: (id: number) => get<Employee>(`/api/employees/${id}`),
  create: (data: Omit<Employee, 'id'>) => post<Employee>('/api/employees', data),
  update: (id: number, data: Omit<Employee, 'id'>) => put<Employee>(`/api/employees/${id}`, data),
  delete: (id: number) => del(`/api/employees/${id}`),
  getByAgency: (agencyId: number) => get<Employee[]>(`/api/employees/agency/${agencyId}`)
};

export { employeeService }; 