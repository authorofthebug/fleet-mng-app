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

export const employees: Employee[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    agencyId: 1,
    positionId: 1,
    roleId: 1
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '234-567-8901',
    agencyId: 1,
    positionId: 2,
    roleId: 2
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phone: '345-678-9012',
    agencyId: 2,
    positionId: 3,
    roleId: 3
  }
]; 