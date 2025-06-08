'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { driverService, Driver } from '@/lib/api/driver';
import { UserIcon, UserGroupIcon, PlusIcon, PencilSquareIcon, UserCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';

// Interface for driver form data
interface DriverFormData {
  id?: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Interface for driver stats
interface DriverStat {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

// Interface for table column
type TableColumn = {
  key: string;
  label: string;
  render?: (item: Driver) => React.ReactNode;
};

// Interface for DriverFormModal props
interface DriverFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: DriverFormData;
  setFormData: React.Dispatch<React.SetStateAction<DriverFormData>>;
  loading?: boolean;
  error: string | null;
}

// Modal component for the driver form
const DriverFormModal: React.FC<DriverFormModalProps> = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  loading = false,
  error,
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
                {formData.id ? 'Edit Driver' : 'Add New Driver'}
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
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
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
                    {formData.id ? (
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

const DriverPage: React.FC = () => {
  // Use the sidebar width hook to set the CSS variable
  useSidebarWidth();
  
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState<DriverFormData>({
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
  
  // Load drivers on component mount
  const loadDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getAll();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (err) {
      console.error('Error loading drivers:', err);
      setError(t('driver.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [t]);
  
  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingDriver && editingDriver.id) {
        const updatedDriver = await driverService.update(editingDriver.id, formData);
        setDrivers(prevDrivers => 
          prevDrivers.map(driver =>
            driver.id === editingDriver.id ? updatedDriver : driver
          )
        );
      } else {
        const newDriver = await driverService.create(formData);
        setDrivers(prevDrivers => [...prevDrivers, newDriver]);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving driver:', err);
      setError(t('driver.errorSaving'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle edit button click
  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      id: driver.id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      licenseNumber: driver.licenseNumber || '',
      phone: driver.phone || '',
      email: driver.email || '',
      status: driver.status
    });
    setShowForm(true);
  };
  
  // Handle delete button click
  const handleDelete = async (id: string) => {
    if (window.confirm(t('driver.deleteConfirm'))) {
      try {
        setLoading(true);
        setError(null);
        await driverService.delete(id);
        setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== id));
      } catch (err) {
        console.error('Error deleting driver:', err);
        setError(t('driver.errorDeleting'));
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Handle add new driver button click
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
  
  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  // Load drivers on component mount
  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  // Filter drivers based on search and status
  const filterDrivers = useCallback((text: string, status: string, driversList: Driver[] = drivers) => {
    let filtered = [...driversList];

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
  }, [drivers]);

  // Update filtered drivers when search text or status filter changes
  useEffect(() => {
    setFilteredDrivers(filterDrivers(searchText, statusFilter));
  }, [searchText, statusFilter, filterDrivers]);

  // Render the page
  if (!t) return null; // Wait for translations to load

  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: t('driver.fullName'),
      render: (driver: Driver) => (
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-400 mr-3" />
          <span className="font-medium">{`${driver.firstName} ${driver.lastName}`}</span>
        </div>
      ),
    },
    { 
      key: 'licenseNumber', 
      label: t('driver.licenseNumber'),
      render: (driver: Driver) => driver.licenseNumber || '-',
    },
    { 
      key: 'email', 
      label: t('driver.email'),
      render: (driver: Driver) => driver.email || '-',
    },
    { 
      key: 'phone', 
      label: t('driver.phone'),
      render: (driver: Driver) => driver.phone || '-',
    },
    {
      key: 'status',
      label: t('driver.status'),
      render: (driver: Driver) => {
        const statusClass = driver.status === 'ACTIVE' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800';
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {driver.status === 'ACTIVE' ? t('driver.statusActive') : t('driver.statusInactive')}
          </span>
        );
      },
    },
  ];

  // Define driver stats
  const driverStats: DriverStat[] = [
    {
      label: t('driver.activeDrivers'),
      value: loading ? '-' : filteredDrivers.filter(d => d.status === 'ACTIVE').length,
      icon: UserIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: t('driver.inactiveDrivers'),
      value: loading ? '-' : filteredDrivers.filter(d => d.status === 'INACTIVE').length,
      icon: UserIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: t('driver.totalDrivers'),
      value: loading ? '-' : filteredDrivers.length,
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
        {/* Header with title and add button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('driver.title')}</h1>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            {t('driver.addDriver')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {driverStats.map((stat, idx) => (
            <div key={idx} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.label}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200">
            <DataTable<Driver>
              columns={columns}
              data={filteredDrivers}
              onEdit={handleEdit}
              loading={loading}
              onDelete={()=>{}}
            />
          </div>
        </div>
      {/* Driver Form Modal */}
      <DriverFormModal
        show={showForm}
        onClose={handleFormCancel}
        onSubmit={handleFormSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        error={error}
      />
      </div>

  );
};

export default DriverPage;
