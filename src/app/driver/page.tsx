'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { driverService, Driver } from '@/lib/api/driver';

export default function DriverPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Driver, 'id'>>({
    firstName: '',
    lastName: '',
    licenseNumber: '',
    phone: '',
    email: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      setError(error instanceof Error ? error.message : 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
      email: driver.email,
      status: driver.status
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        setError(null);
        await driverService.delete(id);
        setDrivers(drivers.filter(driver => driver.id !== id));
      } catch (error) {
        console.error('Error deleting driver:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete driver');
      }
    }
  };*/

  const handleAdd = () => {
    setEditingDriver(null);
    setFormData({
      firstName: '',
      lastName: '',
      licenseNumber: '',
      phone: '',
      email: '',
      status: 'ACTIVE'
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingDriver) {
        const updatedDriver = await driverService.update(editingDriver.id, formData);
        setDrivers(drivers.map(driver =>
          driver.id === editingDriver.id ? updatedDriver : driver
        ));
      } else {
        const newDriver = await driverService.create(formData);
        setDrivers([...drivers, newDriver]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving driver:', error);
      setError(error instanceof Error ? error.message : 'Failed to save driver');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (driver: Driver) => (
        <span>{driver.firstName} {driver.lastName}</span>
      )
    },
    { key: 'licenseNumber', label: 'License Number' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (driver: Driver) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          driver.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
          driver.status === 'INACTIVE' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-500'
        }`}>
          {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Driver Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Driver
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
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
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
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
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
                  {editingDriver ? 'Update' : 'Create'}
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
              data={drivers}
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