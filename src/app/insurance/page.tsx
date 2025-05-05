'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { insuranceService, Insurance } from '@/lib/api/insurance';
import { Vehicle, vehicleService } from '@/lib/api/vehicle';
//import { Vehicle } from '@/lib/types';

export default function InsurancePage() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Insurance, 'id'>>({
    vehicleId: '',
    provider: '',
    policyNumber: '',
    startDate: '',
    endDate: '',
    coverage: '',
    premium: 0,
    status: 'active',
    documents: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [insurancesData, vehiclesData] = await Promise.all([
        insuranceService.getAll(),
        vehicleService.getAll()
      ]);
      setInsurances(insurancesData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };
/*
  const handleEdit = (insurance: Insurance) => {
    setFormData({
      vehicleId: insurance.vehicleId,
      provider: insurance.provider,
      policyNumber: insurance.policyNumber,
      startDate: insurance.startDate,
      endDate: insurance.endDate,
      coverage: insurance.coverage,
      premium: insurance.premium,
      status: insurance.status,
      documents: insurance.documents
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this insurance record?')) {
      try {
        await insuranceService.delete(id.toString());
        setInsurances(insurances.filter(insurance => insurance.id !== id.toString()));
      } catch (err) {
        setError('Failed to delete insurance record');
        console.error('Error deleting insurance:', err);
      }
    }
  };*/

  const handleAdd = () => {
    setFormData({
      vehicleId: '',
      provider: '',
      policyNumber: '',
      startDate: '',
      endDate: '',
      coverage: '',
      premium: 0,
      status: 'active',
      documents: []
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.vehicleId) {
        const updatedInsurance = await insuranceService.update(formData.vehicleId, formData);
        setInsurances(insurances.map(insurance => 
          insurance.id === formData.vehicleId ? updatedInsurance : insurance
        ));
      } else {
        const newInsurance = await insuranceService.create(formData);
        setInsurances([...insurances, newInsurance]);
      }
      setShowForm(false);
    } catch (err) {
      setError('Failed to save insurance record');
      console.error('Error saving insurance:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadedUrl = await insuranceService.uploadDocument(formData);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, uploadedUrl]
      }));
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    }
  };

  const handleRemoveDocument = async (documentUrl: string) => {
    try {
      await insuranceService.removeDocument(documentUrl);
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
    { key: 'provider', label: 'Provider' },
    { key: 'policyNumber', label: 'Policy Number' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' },
    { key: 'menu', label: 'Actions' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Insurance Records</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Insurance
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
                {formData.vehicleId ? 'Edit Insurance' : 'Add Insurance'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vehicle
                  </label>
                  <select
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
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
                    Policy Number
                  </label>
                  <input
                    type="text"
                    value={formData.policyNumber}
                    onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Coverage
                  </label>
                  <input
                    type="text"
                    value={formData.coverage}
                    onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Premium
                  </label>
                  <input
                    type="number"
                    value={formData.premium}
                    onChange={(e) => setFormData({ ...formData, premium: parseFloat(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Insurance['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
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
                      {formData.documents.map((url: string, index: number) => (
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
          data={insurances}
          columns={columns}
          onEdit={()=>{}}
          onDelete={()=>{}}
          loading={loading}
        />
      </div>
    </Layout>
  );
} 