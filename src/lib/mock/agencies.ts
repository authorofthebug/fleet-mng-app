import {Agency} from "@/lib/api/agency";

export const mockAgencies: Agency[] = [
  {
    id: 1,
    name: "Agency 1",
    company: { id: 1, name: "Company 1", agencies:[] },
    employees: [],
    employeeCount:1,
    status: 'active'
  },
  // ... other agencies
]; 