'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { vehicleService, Vehicle } from '@/lib/api/vehicle';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';
import {
  TruckIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilSquareIcon,
  //TrashIcon
} from '@heroicons/react/24/outline';

// Modal component for the vehicle form
const VehicleFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingVehicle
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: Vehicle;
  setFormData: React.Dispatch<React.SetStateAction<Vehicle>>;
  editingVehicle: Vehicle | null;
}) => {
  if (!show) return null;

  // Get the sidebar width - could be 16rem (expanded) or 4rem (collapsed)
  // We'll use a CSS variable to make it responsive
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
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</label>
                    <input
                      type="text"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Year</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Vehicle['status'] })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                    >
                      <option value="NEW" className="text-sm">New</option>
                      <option value="ACTIVE" className="text-sm">Available</option>
                      <option value="IN_SERVICE" className="text-sm">In Service</option>
                      <option value="IN_MAINTENANCE" className="text-sm">In Maintenance</option>
                      <option value="WITH_ISSUE" className="text-sm">With Issue</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                    rows={3}
                  />
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
                    {editingVehicle ? (
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

export default function VehiclePage() {
  // Use the sidebar width hook to set the CSS variable
  useSidebarWidth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText] = useState<string>('');
  const [statusFilter] = useState<string>('');
  // No tabs are used anymore
  const [formData, setFormData] = useState<Vehicle>({
    id: '',
    brand: '',
    licensePlate: '',
    model: '',
    year: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    color: '',
    notes: '',
    status: 'ACTIVE',
    plateNumber: '',
    make: '',
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to load vehicle...');
      const data = await vehicleService.getAll();
      console.log('Vehicles loaded successfully:', data);
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error('Error loading vehicle:', error);
      let errorMessage = 'Failed to load vehicle';
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      id: vehicle.id, // Add this line
      brand: vehicle.brand || vehicle.make || '',
      licensePlate: vehicle.licensePlate || vehicle.plateNumber || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      color: vehicle.color || '',
      notes: vehicle.notes || '',
      status: vehicle.status || 'AVAILABLE',
      plateNumber: vehicle.plateNumber || vehicle.licensePlate || '',
      make: vehicle.make || vehicle.brand || '',
      createdAt: vehicle.createdAt || '',
      updatedAt: vehicle.updatedAt || '',
    });
    setShowForm(true);
  };
  /*
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        setError(null);
        await vehicleService.delete(id);
        const updatedVehicles = vehicle.filter(vehicle => vehicle.id !== id);
        setVehicles(updatedVehicles);
        // Apply filtering to the updated vehicle array directly
        filterVehicles(searchText, statusFilter, updatedVehicles);
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete vehicle');
      }
    }
  };
*/
  const handleAdd = () => {
    setEditingVehicle(null);
    setFormData({
      id: '',
      brand: 'Tesla',
      licensePlate: 'JKL012',
      model: 'Model 3',
      year: 1920,
      color: 'Red',
      notes: 'Just added to fleet, pending first inspection',
      status: 'NEW',
      plateNumber: 'JKL012',
      make: 'Tesla',
      createdAt: '',
      updatedAt: '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingVehicle) {
        const id = editingVehicle.id;
        console.log('Updating vehicle with ID:', id, 'Data:', formData);
        const updatedVehicle = await vehicleService.update(id, formData);
        console.log('Vehicle updated successfully:', updatedVehicle);
        const updatedVehicles = vehicles.map(vehicle =>
          vehicle.id === id ? updatedVehicle : vehicle
        );
        setVehicles(updatedVehicles);
        // Apply filtering to the updated vehicle array directly
        filterVehicles(searchText, statusFilter, updatedVehicles);
      } else {
        console.log('Creating new vehicle with data:', formData);
        const newVehicle = await vehicleService.create(formData);
        console.log('Vehicle created successfully:', newVehicle);
        const updatedVehicles = [...vehicles, newVehicle];
        setVehicles(updatedVehicles);
        // Apply filtering to the updated vehicle array directly
        filterVehicles(searchText, statusFilter, updatedVehicles);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      let errorMessage = 'Failed to save vehicle';
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
      }
      setError(errorMessage);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  // Function to filter vehicle based on search text and status
  const filterVehicles = (text: string, status: string, vehiclesToFilter = vehicles) => {
    let filtered = [...vehiclesToFilter];

    // Filter by status if selected
    if (status) {
      filtered = filtered.filter(vehicle =>
        vehicle.status === status ||
        // Handle legacy status values
        (status === 'AVAILABLE' && vehicle.status === 'active') ||
        (status === 'IN_MAINTENANCE' && vehicle.status === 'maintenance') ||
        (status === 'WITH_ISSUE' && vehicle.status === 'inactive')
      );
    }

    // Filter by search text if provided
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(vehicle => {
        // Search across all relevant fields
        return (
          (vehicle.licensePlate && vehicle.licensePlate.toLowerCase().includes(searchLower)) ||
          (vehicle.plateNumber && vehicle.plateNumber.toLowerCase().includes(searchLower)) ||
          (vehicle.brand && vehicle.brand.toLowerCase().includes(searchLower)) ||
          (vehicle.make && vehicle.make.toLowerCase().includes(searchLower)) ||
          (vehicle.model && vehicle.model.toLowerCase().includes(searchLower)) ||
          (vehicle.year && vehicle.year.toString().includes(searchLower)) ||
          (vehicle.color && vehicle.color.toLowerCase().includes(searchLower)) ||
          (vehicle.notes && vehicle.notes.toLowerCase().includes(searchLower))
        );
      });
    }

    setFilteredVehicles(filtered);
  };

  const columns = [
    {
      key: 'licensePlate',
      label: 'License Plate',
      render: (vehicle: Vehicle) => vehicle.plateNumber || vehicle.licensePlate
    },
    {
      key: 'brand',
      label: 'Brand',
      render: (vehicle: Vehicle) => vehicle.make || vehicle.brand
    },
    { key: 'model', label: 'Model' },
    { 
      key: 'year', 
      label: 'Year',
      render: (vehicle: Vehicle) => {
        // If it's a date format, display just the year
        if (vehicle.year && typeof vehicle.year === 'string' && vehicle.year.includes('-')) {
          const date = new Date(vehicle.year);
          // Format as DD/MM/YYYY if it's a full date
          if (!isNaN(date.getTime())) {
            //YYYY
            return date.getFullYear().toString();
          }
        }
        // Otherwise return as is
        return vehicle.year;
      }
    },
    { key: 'color', label: 'Color' },
    {
      key: 'status',
      label: 'Status',
      render: (vehicle: Vehicle) => {
        // Define status colors that match the dashboard stats
        const statusColors = {
          'NEW': 'bg-blue-100 text-blue-700',
          'ACTIVE': 'bg-blue-100 text-blue-700',
          'AVAILABLE': 'bg-blue-100 text-blue-700',
          'IN_SERVICE': 'bg-green-100 text-green-600',
          'IN_MAINTENANCE': 'bg-yellow-100 text-yellow-500',
          'WITH_ISSUE': 'bg-red-100 text-red-600',
          'inactive': 'bg-red-100 text-red-600'
        };

        const statusKey = vehicle.status as keyof typeof statusColors;
        const colorClass = statusColors[statusKey] || 'bg-gray-100 text-gray-800';

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {typeof vehicle.status === 'string' ? vehicle.status.replace('_', ' ') : vehicle.status}
          </span>
        );
      }
    }
  ];

  // Dashboard stats - using the filtered vehicle to update stats based on filters
  const vehicleStats = [
    {
      label: "Available Vehicles",
      icon: TruckIcon,
      value: filteredVehicles.filter(v => v.status === 'ACTIVE' || v.status === 'active').length,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      label: "In Service",
      icon: Cog6ToothIcon,
      value: filteredVehicles.filter(v => v.status === 'IN_SERVICE').length,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "In Maintenance",
      icon: WrenchScrewdriverIcon,
      value: filteredVehicles.filter(v => v.status === 'IN_MAINTENANCE' || v.status === 'maintenance').length,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      label: "With Issues",
      icon: ExclamationTriangleIcon,
      value: filteredVehicles.filter(v => v.status === 'WITH_ISSUE' || v.status === 'inactive').length,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Title removed as requested */}

        {error && (
          <Notification
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {vehicleStats.map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Inventory Section */}

        <div className="relative">
          {/* Vehicle form modal */}
          <VehicleFormModal
              show={showForm}
              onClose={handleFormCancel}
              onSubmit={handleFormSubmit}
              formData={formData}
              setFormData={setFormData}
              editingVehicle={editingVehicle}
          />

          {/* Inventory content */}

          {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
          )}
          <DataTable
              data={filteredVehicles}
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
            Add Vehicle
          </span>
        </button>
      </div>
    </Layout>
  );
}
