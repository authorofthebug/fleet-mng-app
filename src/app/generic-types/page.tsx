'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { parameterService, Parameter } from '@/lib/api/parameter';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';
import {

  PlusIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';


// Modal component for the parameter form
const ParameterFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingParameter
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: Parameter;
  setFormData: React.Dispatch<React.SetStateAction<Parameter>>;
  editingParameter: Parameter | null;
}) => {
  if (!show) return null;

  // Ensure all form values are defined strings to prevent uncontrolled to controlled warnings
  const safeFormData = {
    ...formData,
    name: formData.name || '',
    category: formData.category || '',
    status: formData.status || 'ACTIVE',
    description: formData.description || ''
  };

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
                {editingParameter ? 'Edit Parameter' : 'Add New Parameter'}
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
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={safeFormData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                    <select
                      value={safeFormData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="CONDITION">CONDITION</option>
                      <option value="VEHICLE">VEHICLE</option>
                      <option value="DOCUMENT">DOCUMENT</option>
                      <option value="SERVICE">SERVICE</option>
                      <option value="FUEL">FUEL</option>
                      <option value="ISSUES">ISSUES</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      value={safeFormData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:col-span-3">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                    <textarea
                      value={safeFormData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      rows={3}
                    />
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
                    {editingParameter ? (
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

export default function GenericTypesPage() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState<Parameter>({
    id: 0,
    name: '',
    value: '',
    category: '',
    status: 'ACTIVE',
    description: ''
  });
  const [searchTerm] = useState('');

  // Use the sidebar width hook
  useSidebarWidth();

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const data = await parameterService.getAll();
      setParameters(data);
    } catch (error) {
      console.error('Error fetching parameters:', error);
      setNotification({ type: 'error', message: 'Failed to load parameters' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingParameter(null);
    setFormData({
      id: 0,
      name: '',
      value: '',
      category: '',
      status: 'ACTIVE',
      description: ''
    });
    setShowForm(true);
  };

  const handleEdit = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setFormData({
      ...parameter,
      name: parameter.name || '',
      description: parameter.description || '',
      category: parameter.category || '',
      status: parameter.status || 'active'
    });
    setShowForm(true);
  };

  /*const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this parameter?')) {
      try {
        await parameterService.delete(id);
        setParameters(parameters.filter(p => p.id !== id));
        setNotification({ type: 'success', message: 'Parameter deleted successfully' });
      } catch (error) {
        console.error('Error deleting parameter:', error);
        setNotification({ type: 'error', message: 'Failed to delete parameter' });
      }
    }
  };*/

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingParameter) {
        const id = editingParameter.id;
        const updatedParameter = await parameterService.update(id, formData);
        setParameters(parameters.map(parameter =>
          parameter.id === id ? updatedParameter : parameter
        ));
        setNotification({ type: 'success', message: 'Parameter updated successfully' });
      } else {
        const newParameter = await parameterService.create(formData);
        setParameters([...parameters, newParameter]);
        setNotification({ type: 'success', message: 'Parameter created successfully' });
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving parameter:', error);
      setNotification({ type: 'error', message: 'Failed to save parameter' });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const filteredParameters = parameters.filter(parameter => 
    parameter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parameter.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parameter.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { 
      key: 'status', 
      label: 'Status',
      render: (parameter: Parameter) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          parameter.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-800'
        }`}>
          {parameter.status.charAt(0).toUpperCase() + parameter.status.slice(1)}
        </span>
      )
    },
  ];

  return (
    <Layout>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="p-6">

        <ParameterFormModal
          show={showForm}
          onClose={handleFormCancel}
          onSubmit={handleFormSubmit}
          formData={formData}
          setFormData={setFormData}
          editingParameter={editingParameter}
        />

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <DataTable
            data={filteredParameters}
            columns={columns}
            onEdit={handleEdit}
            onDelete={()=>{}}
          />
        </div>
      </div>
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
          Add Parameter
        </span>
      </button>
    </Layout>
  );
}