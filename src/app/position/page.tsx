'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import { positionService, Position } from '@/lib/api/position';

export default function PositionPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Position, 'id'>>({
    name: '',
    description: 1,
    status: 'active',
    employees: []
  });

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await positionService.getAll();
      setPositions(data);
    } catch (error) {
      console.error('Error loading positions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setFormData({
      name: position.name,
      description: position.description,
      status: position.status,
      employees: position.employees
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this position?')) {
      try {
        setError(null);
        await positionService.delete(id);
        setPositions(positions.filter(position => position.id !== id));
        // Show success message
        setError('Position deleted successfully');
        setTimeout(() => setError(null), 3000);
      } catch (error) {
        console.error('Error deleting position:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete position');
      }
    }
  };*/

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingPosition) {
        const updatedPosition = await positionService.update(editingPosition.id, formData);
        setPositions(positions.map(position => 
          position.id === editingPosition.id ? updatedPosition : position
        ));
      } else {
        const newPosition = await positionService.create(formData);
        setPositions([...positions, newPosition]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving position:', error);
      setError(error instanceof Error ? error.message : 'Failed to save position');
    }
  };

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (position: Position) => (
        <span className="font-medium text-gray-900">{position.name}</span>
      )
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (position: Position) => (
        <span className="text-sm text-gray-500">{position.description}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (position: Position) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${position.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'}`}>
          {position.status}
        </span>
      )
    },
    { 
      key: 'employees', 
      label: 'Employees',
      render: (position: Position) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {position.employees.length}
        </span>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Position Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your positions and role assignments
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPosition(null);
              setFormData({
                name: '',
                description: 1,
                status: 'active',
                employees: []
              });
              setShowForm(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-transparent 
                       rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Position
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm ? (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {editingPosition ? 'Edit Position' : 'Add New Position'}
              </h3>
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Position Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-base font-medium text-gray-900 bg-white border
                             border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 
                             focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter position name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({
                      ...formData, description: parseInt(e.type)
                    })}
                    className="w-full px-4 py-2.5 text-base font-medium text-gray-900 bg-white border
                             border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 
                             focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter position description"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 text-base font-medium text-gray-900 bg-white border
                             border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 
                             focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                             border-gray-300 rounded-md shadow-sm hover:bg-gray-50 
                             focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium 
                             text-white bg-blue-600 border border-transparent rounded-md 
                             shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 
                             focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingPosition ? 'Update Position' : 'Create Position'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <DataTable
              data={positions}
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