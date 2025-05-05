export interface Insurance {
  id: string;
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverage: string;
  premium: number;
  status: 'active' | 'inactive' | 'pending';
  documents: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id: string,
  clientId: string,
  employeeId: string,
  startDate: string,
  endDate: string,
  status: string,
  documents: string[]

}

export interface Client {
  id: string,
  name: string,
}

export interface Employee {
  id: string,
  firstName: string,
  lastName: string,
}