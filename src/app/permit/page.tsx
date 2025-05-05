'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { permitService, Permit } from '@/lib/api/permit';
import { vehicleService } from '@/lib/api/vehicle';
import { Vehicle } from '@/lib/api/vehicle';

export default function PermitPage() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  const [formData, setFormData] = useState<Omit<Permit, 'id' | 'createdAt' | 'updatedAt'>>({
    vehicleId: 0,
    type: 'registration',
    number: '',
    issueDate: '',
    expiryDate: '',
    status: 'active',
    issuingAuthority: '',
    documents: [],
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [permitsData, vehiclesData] = await Promise.all([
        permitService.getAll(),
        vehicleService.getAll()
      ]);
      setPermits(permitsData);
      setVehicles(vehiclesData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    }
  };

  const handleEdit = (permit: Permit) => {
    setEditingPermit(permit);
    setFormData({
      vehicleId: permit.vehicleId,
      type: permit.type,
      number: permit.number,
      issueDate: permit.issueDate,
      expiryDate: permit.expiryDate,
      status: permit.status,
      issuingAuthority: permit.issuingAuthority,
      documents: permit.documents,
      notes: permit.notes
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      try {
        await permitService.delete(id);
        setPermits(permits.filter(permit => permit.id !== id));
      } catch (err) {
        setError('Failed to delete permit');
        console.error('Error deleting permit:', err);
      }
    }
  };*/

  const handleAdd = () => {
    setEditingPermit(null);
    setFormData({
      vehicleId: 0,
      type: 'registration',
      number: '',
      issueDate: '',
      expiryDate: '',
      status: 'active',
      issuingAuthority: '',
      documents: [],
      notes: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermit) {
        const updatedPermit = await permitService.update(editingPermit.id, formData);
        setPermits(permits.map(permit => 
          permit.id === editingPermit.id ? updatedPermit : permit
        ));
      } else {
        const newPermit = await permitService.create(formData);
        setPermits([...permits, newPermit]);
      }
      setShowForm(false);
    } catch (err) {
      setError('Failed to save permit');
      console.error('Error saving permit:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await permitService.uploadDocument(formData);
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
      await permitService.removeDocument(documentUrl);
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
    { key: 'number', label: 'Number' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'expiryDate', label: 'Expiry Date' },
    { key: 'status', label: 'Status' },
    { key: 'issuingAuthority', label: 'Issuing Authority' },
    { key: 'menu', label: 'Actions' }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Permits</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Permit
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
                {editingPermit ? 'Edit Permit' : 'Add Permit'}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Permit['type'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="registration">Registration</option>
                    <option value="insurance">Insurance</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Permit['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={formData.issuingAuthority}
                    onChange={(e) => setFormData({ ...formData, issuingAuthority: e.target.value })}
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
          data={permits}
          columns={columns}
          onEdit={handleEdit}
          onDelete={()=>{}}
        />
      </div>
    </Layout>
  );
} 