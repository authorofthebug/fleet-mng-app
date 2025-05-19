'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { driverService, Driver } from '@/lib/api/driver';
import { UserIcon, UserCircleIcon, PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';

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
      {/* Overlay that covers only the main content area */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
        onClick={onClose}
        style={{ left: 'var(--sidebar-width, 16rem)' }}
      ></div>

      {/* Modal container positioned in the main content area */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ left: 'var(--sidebar-width, 16rem)' }}
      >
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
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="licenseNumber" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License Number
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="status" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Driver['status'] })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    >
                      <option value="ACTIVE" className="text-green-600">Active</option>
                      <option value="INACTIVE" className="text-red-600">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
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
  // Use the sidebar width hook to set the CSS variable
  useSidebarWidth();
  
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
  const [searchText] = useState<string>('');
  const [statusFilter] = useState<string>('');
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
  /*
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
            onDelete={()=>{}}
          />
        </div>
        
        {/* Floating Add Button */}
        <button
          onClick={handleAdd}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 hover:scale-110 group"
        >
          {/* Animated background effect */}
          <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 group-hover:animate-gradient-x transition-opacity"></span>
          
          {/* Shine effect */}
          <span className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
          
          {/* Button content */}
          <PlusIcon className="h-6 w-6 text-white relative z-10" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Add Driver
          </span>
        </button>
      </div>
    </Layout>
  );
}
