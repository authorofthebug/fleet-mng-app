'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { maintenanceService, Maintenance } from '@/lib/api/maintenance';
import { vehicleService } from '@/lib/api/vehicle';
import { Vehicle } from '@/lib/api/vehicle';

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState<Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>>({
    vehicleId: 0,
    type: 'preventive',
    description: '',
    date: '',
    cost: 0,
    status: 'scheduled',
    provider: '',
    documents: [],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [maintenancesData, vehiclesData] = await Promise.all([
        maintenanceService.getAll(),
        vehicleService.getAll()
      ]);
      setMaintenances(maintenancesData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
    setFormData({
      vehicleId: maintenance.vehicleId,
      type: maintenance.type,
      description: maintenance.description,
      date: maintenance.date,
      cost: maintenance.cost,
      status: maintenance.status,
      provider: maintenance.provider,
      documents: maintenance.documents,
      notes: maintenance.notes
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceService.delete(id);
        setMaintenances(maintenances.filter(maintenance => maintenance.id !== id));
      } catch (err) {
        setError('Failed to delete maintenance record');
        console.error('Error deleting maintenance:', err);
      }
    }
  };*/

  const handleAdd = () => {
    setEditingMaintenance(null);
    setFormData({
      vehicleId: 0,
      type: 'preventive',
      description: '',
      date: '',
      cost: 0,
      status: 'scheduled',
      provider: '',
      documents: [],
      notes: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMaintenance) {
        const updatedMaintenance = await maintenanceService.update(editingMaintenance.id, formData);
        setMaintenances(maintenances.map(maintenance => 
          maintenance.id === editingMaintenance.id ? updatedMaintenance : maintenance
        ));
      } else {
        const newMaintenance = await maintenanceService.create(formData);
        setMaintenances([...maintenances, newMaintenance]);
      }
      setShowForm(false);
    } catch (err) {
      setError('Failed to save maintenance record');
      console.error('Error saving maintenance:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await maintenanceService.uploadDocument(formData);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, response.url]
      }));
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    }
  };

  const handleRemoveDocument = async (documentUrl: string) => {
    try {
      await maintenanceService.removeDocument(documentUrl);
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter(url => url !== documentUrl)
      }));
    } catch (err) {
      setError('Failed to remove document');
      console.error('Error removing document:', err);
    }
  };

  const columns = [
    { key: 'vehicleId', label: 'Vehicle' },
    { key: 'type', label: 'Type' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'provider', label: 'Provider' },
    { key: 'cost', label: 'Cost' },
    { key: 'menu', label: 'Actions' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Maintenance Records</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Maintenance
          </button>
        </div>

        {error && (
          <Notification
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingMaintenance ? 'Edit Maintenance' : 'Add Maintenance'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Maintenance['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="preventive">Preventive</option>
                    <option value="corrective">Corrective</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cost
                  </label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Maintenance['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Documents
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="mt-1 block w-full"
                  />
                  {formData.documents.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {formData.documents.map((url, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{url}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(url)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DataTable
          data={maintenances}
          columns={columns}
          onEdit={handleEdit}
          onDelete={()=>{}}
        />
      </div>
    </Layout>
  );
} 