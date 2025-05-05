'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { employeeService, Employee } from '@/lib/api/employee';
import { agencyService, Agency } from '@/lib/api/agency';
import { positionService, Position } from '@/lib/api/position';
import { roleService, Role } from '@/lib/api/role';

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agencyId: 0,
    positionId: 0,
    roleId: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load each service individually to better handle errors
      try {
        const employeesData = await employeeService.getAll();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        setError(error instanceof Error ? error.message : 'Failed to load employees');
        return;
      }

      try {
        const agenciesData = await agencyService.getAll();
        setAgencies(agenciesData);
      } catch (error) {
        console.error('Error loading agencies:', error);
        setError(error instanceof Error ? error.message : 'Failed to load agencies');
        return;
      }

      try {
        const positionsData = await positionService.getAll();
        setPositions(positionsData);
      } catch (error) {
        console.error('Error loading positions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load positions');
        return;
      }

      try {
        const rolesData = await roleService.getAll();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading roles:', error);
        setError(error instanceof Error ? error.message : 'Failed to load roles');
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      agencyId: employee.agencyId,
      positionId: employee.positionId,
      roleId: employee.roleId
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setError(null);
        await employeeService.delete(id);
        setEmployees(employees.filter(employee => employee.id !== id));
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete employee');
      }
    }
  };
*/
  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      agencyId: 0,
      positionId: 0,
      roleId: 0
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingEmployee) {
        const updatedEmployee = await employeeService.update(editingEmployee.id, formData);
        setEmployees(employees.map(employee => 
          employee.id === editingEmployee.id ? updatedEmployee : employee
        ));
      } else {
        const newEmployee = await employeeService.create(formData);
        setEmployees([...employees, newEmployee]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      setError(error instanceof Error ? error.message : 'Failed to save employee');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const getAgencyName = (agencyId: number) => {
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? agency.name : 'Unknown';
  };

  const getPositionName = (positionId: number) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : 'Unknown';
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'agencyId', 
      label: 'Agency',
      render: (employee: Employee) => getAgencyName(employee.agencyId)
    },
    { 
      key: 'positionId', 
      label: 'Position',
      render: (employee: Employee) => getPositionName(employee.positionId)
    },
    { 
      key: 'roleId', 
      label: 'Role',
      render: (employee: Employee) => getRoleName(employee.roleId)
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Employee
          </button>
        </div>

        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {showForm ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Agency</label>
                <select
                  value={formData.agencyId}
                  onChange={(e) => setFormData({ ...formData, agencyId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select an agency</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <select
                  value={formData.positionId}
                  onChange={(e) => setFormData({ ...formData, positionId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select a position</option>
                  {positions.map(position => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleFormCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingEmployee ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <DataTable
              data={employees}
              columns={columns}
              onEdit={handleEdit}
              onDelete={()=>{}}
            />
          </div>
        )}
      </div>
    </Layout>
  );
} 