'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { driverService, Driver } from '@/lib/api/driver';
import {UserIcon, UserCircleIcon, PlusIcon, PencilSquareIcon} from '@heroicons/react/24/outline';

// Modal component for the driver form
const DriverFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingDriver
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: Omit<Driver, 'id'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Driver, 'id'>>>;
  editingDriver: Driver | null;
}) => {
  if (!show) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
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
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {editingDriver ? (
                      <>
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  // Add search and filter state
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    loadDrivers();
  }, []);

  // Update filtered drivers when drivers, search text, or status filter changes
  useEffect(() => {
    setFilteredDrivers(filterDrivers(searchText, statusFilter));
  }, [drivers, searchText, statusFilter]);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getAll();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      setError(error instanceof Error ? error.message : 'Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

   // Filter drivers based on search text and status
  const filterDrivers = (text: string, status: string, driversToFilter = drivers) => {
    let filtered = [...driversToFilter];

    // Filter by status if selected
    if (status) {
      filtered = filtered.filter(driver => driver.status === status);
    }

    // Filter by search text if provided
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(driver => {
        return (
          `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchLower) ||
          (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchLower)) ||
          (driver.phone && driver.phone.toLowerCase().includes(searchLower)) ||
          (driver.email && driver.email.toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
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
  const handleDelete = async (id: string) => {
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
  };

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

  // Driver stats based on filtered drivers
  const driverStats = [
    {
      label: "Active Drivers",
      icon: UserCircleIcon,
      value: filteredDrivers.filter(d => d.status === 'ACTIVE').length,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Inactive Drivers",
      icon: UserIcon,
      value: filteredDrivers.filter(d => d.status === 'INACTIVE').length,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: "Total Drivers",
      icon: UserIcon,
      value: filteredDrivers.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {driverStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-full mr-4`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-white/90 rounded-xl shadow p-6">
          <div className="relative">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white w-64"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <select
                  className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE" className="text-green-600">Active</option>
                  <option value="INACTIVE" className="text-red-600">Inactive</option>
                </select>
              </div>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Driver
              </button>
            </div>
          </div>
        </div>

        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {/* Driver form modal */}
        <DriverFormModal
          show={showForm}
          onClose={handleFormCancel}
          onSubmit={handleFormSubmit}
          formData={formData}
          setFormData={setFormData}
          editingDriver={editingDriver}
        />

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <DataTable
            data={filteredDrivers}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}
