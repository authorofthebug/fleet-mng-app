export interface Certification {
  id: number;
  name: string;
  description: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  employeeId: number;
}

export const certifications: Certification[] = [
  {
    id: 1,
    name: 'Commercial Driver\'s License',
    description: 'License to operate commercial vehicle',
    expiryDate: new Date(Date.now() + 86400000 * 365).toISOString(),
    status: 'active',
    employeeId: 1
  },
  {
    id: 2,
    name: 'Hazardous Materials Endorsement',
    description: 'Certification to transport hazardous materials',
    expiryDate: new Date(Date.now() + 86400000 * 180).toISOString(),
    status: 'active',
    employeeId: 2
  },
  {
    id: 3,
    name: 'First Aid Certification',
    description: 'Basic first aid and CPR training',
    expiryDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    status: 'expired',
    employeeId: 3
  }
]; 