'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { certificationService, Certification } from '@/lib/api/certification';
import { employeeService, Employee } from '@/lib/api/employee';

export default function CertificationPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    description: '',
    expiryDate: '',
    status: 'active',
    employeeId: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [certificationsData, employeesData] = await Promise.all([
        certificationService.getAll(),
        employeeService.getAll()
      ]);
      setCertifications(certificationsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({
      name: certification.name,
      description: certification.description,
      expiryDate: certification.expiryDate,
      status: certification.status,
      employeeId: certification.employeeId
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        setError(null);
        await certificationService.delete(id);
        setCertifications(certifications.filter(cert => cert.id !== id));
      } catch (error) {
        console.error('Error deleting certification:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete certification');
      }
    }
  };*/

  const handleAdd = () => {
    setEditingCertification(null);
    setFormData({
      name: '',
      description: '',
      expiryDate: '',
      status: 'active',
      employeeId: 0
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingCertification) {
        const updatedCertification = await certificationService.update(editingCertification.id, formData);
        setCertifications(certifications.map(cert => 
          cert.id === editingCertification.id ? updatedCertification : cert
        ));
      } else {
        const newCertification = await certificationService.create(formData);
        setCertifications([...certifications, newCertification]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving certification:', error);
      setError(error instanceof Error ? error.message : 'Failed to save certification');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'employeeId', 
      label: 'Employee',
      render: (certification: Certification) => getEmployeeName(certification.employeeId)
    },
    { 
      key: 'expiryDate', 
      label: 'Expiry Date',
      render: (certification: Certification) => new Date(certification.expiryDate).toLocaleDateString()
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (certification: Certification) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          certification.status === 'active' ? 'bg-green-100 text-green-800' :
          certification.status === 'expired' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {certification.status.charAt(0).toUpperCase() + certification.status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Certification Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Certification
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
              {editingCertification ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Certification['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
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
                  {editingCertification ? 'Update' : 'Create'}
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
              data={certifications}
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