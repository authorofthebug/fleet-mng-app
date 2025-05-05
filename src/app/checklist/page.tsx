'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { checklistService, Checklist, ChecklistItem } from '@/lib/api/checklist';
import { vehicleService, Vehicle } from '@/lib/api/vehicle';

export default function ChecklistPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Checklist, 'id'>>({
    name: '',
    description: '',
    items: [],
    status: 'active',
    vehicleId: 0
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [checklistsData, vehiclesData] = await Promise.all([
        checklistService.getAll(),
        vehicleService.getAll()
      ]);
      setChecklists(checklistsData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (checklist: Checklist) => {
    setEditingChecklist(checklist);
    setFormData({
      name: checklist.name,
      description: checklist.description,
      items: checklist.items,
      status: checklist.status,
      vehicleId: checklist.vehicleId
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this checklist?')) {
      try {
        setError(null);
        await checklistService.delete(id);
        setChecklists(checklists.filter(checklist => checklist.id !== id));
      } catch (error) {
        console.error('Error deleting checklist:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete checklist');
      }
    }
  };*/

  const handleAdd = () => {
    setEditingChecklist(null);
    setFormData({
      name: '',
      description: '',
      items: [],
      status: 'active',
      vehicleId: 0
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingChecklist) {
        const updatedChecklist = await checklistService.update(editingChecklist.id, formData);
        setChecklists(checklists.map(checklist => 
          checklist.id === editingChecklist.id ? updatedChecklist : checklist
        ));
      } else {
        const newChecklist = await checklistService.create(formData);
        setChecklists([...checklists, newChecklist]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving checklist:', error);
      setError(error instanceof Error ? error.message : 'Failed to save checklist');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            id: Date.now(), // Temporary ID for new items
            description: newItem.trim(),
            isCompleted: false,
            checklistId: editingChecklist?.id || 0
          }
        ]
      });
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const handleToggleItem = (itemId: number) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    });
  };

  const getVehicleName = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Unknown';
  };

  const getCompletedItemsCount = (items: ChecklistItem[]) => {
    return items.filter(item => item.isCompleted).length;
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'vehicleId', 
      label: 'Vehicle',
      render: (checklist: Checklist) => getVehicleName(checklist.vehicleId)
    },
    { 
      key: 'items', 
      label: 'Progress',
      render: (checklist: Checklist) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-600">
            {getCompletedItemsCount(checklist.items)}/{checklist.items.length} items completed
          </span>
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (checklist: Checklist) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          checklist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {checklist.status.charAt(0).toUpperCase() + checklist.status.slice(1)}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Checklist Management</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Checklist
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
              {editingChecklist ? 'Edit Checklist' : 'Add New Checklist'}
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
                <label className="block text-sm font-medium text-gray-700">Vehicle</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({ ...formData, vehicleId: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Checklist['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Checklist Items</label>
                <div className="space-y-2">
                  {formData.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleToggleItem(item.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1">{item.description}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add new item"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>
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
                  {editingChecklist ? 'Update' : 'Create'}
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
              data={checklists}
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