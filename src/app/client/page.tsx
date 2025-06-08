'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { clientService, Client } from '@/lib/api/client';
import { useSidebarWidth } from '@/hooks/useSidebarWidth';
import {
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  PencilSquareIcon,

} from '@heroicons/react/24/outline';

// Modal component for the client form
const ClientFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingClient
}: {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
  setFormData: React.Dispatch<React.SetStateAction<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>>;
  editingClient: Client | null;
}) => {
  const { t } = useTranslation();
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
                {editingClient ? t('client.editClient') : t('client.addClient')}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('client.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('client.email')}
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
                    <label htmlFor="phone" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('client.phone')}
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="taxId" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('client.taxId')}
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="status" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('client.status')}
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                      className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                      required
                    >
                      <option value="ACTIVE" className="text-green-600">{t('client.statusActive')}</option>
                      <option value="INACTIVE" className="text-red-600">{t('client.statusInactive')}</option>
                      <option value="PENDING" className="text-yellow-500">{t('client.statusPending')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="address" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('client.address')}
                  </label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm placeholder-gray-400 bg-blue-50/30 transition-all duration-200 hover:bg-white focus:bg-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="notes" className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('client.notes')}
                  </label>
                  <textarea
                    id="notes"
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
                    {t('client.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    {editingClient ? (
                      <>
                        <PencilSquareIcon className="h-5 w-5 mr-2" />
                        {t('client.update')}
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {t('client.create')}
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

export default function ClientPage() {
  // Use the sidebar width hook to set the CSS variable
  useSidebarWidth();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [searchText] = useState<string>('');
  const [statusFilter] = useState<string>('');
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    status: 'ACTIVE',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting to load client...');
      const data = await clientService.getAll();
      console.log('Clients loaded successfully:', data);
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Error loading client:', error);
      let errorMessage = t('client.errorLoading');
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      taxId: client.taxId || '',
      status: client.status || 'ACTIVE',
      notes: client.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('client.deleteConfirm'))) {
      try {
        setError(null);
        await clientService.delete(id);
        setClients(clients.filter(client => client.id !== id));
        setFilteredClients(filteredClients.filter(client => client.id !== id));
      } catch (error) {
        console.error('Error deleting client:', error);
        let errorMessage = t('client.errorDeleting');
        if (error instanceof Error) {
          errorMessage = `${error.name}: ${error.message}`;
        }
        setError(errorMessage);
      }
    }
  };

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      status: 'ACTIVE',
      notes: ''
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingClient) {
        const id = editingClient.id;
        console.log('Updating client with ID:', id, 'Data:', formData);
        const updatedClient = await clientService.update(id, formData);
        console.log('Client updated successfully:', updatedClient);
        const updatedClients = clients.map(client =>
          client.id === id ? updatedClient : client
        );
        setClients(updatedClients);
        setFilteredClients(
          filterClients(searchText, statusFilter, updatedClients)
        );
      } else {
        console.log('Creating new client with data:', formData);
        const newClient = await clientService.create(formData);
        console.log('Client created successfully:', newClient);
        const updatedClients = [...clients, newClient];
        setClients(updatedClients);
        setFilteredClients(
          filterClients(searchText, statusFilter, updatedClients)
        );
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving client:', error);
      let errorMessage = t('client.errorSaving');
      if (error instanceof Error) {
        errorMessage = `${error.name}: ${error.message}`;
      }
      setError(errorMessage);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  // Function to filter client based on search text and status
  const filterClients = (text: string, status: string, clientsToFilter = clients) => {
    let filtered = [...clientsToFilter];

    // Filter by status if selected
    if (status) {
      filtered = filtered.filter(client => client.status === status);
    }

    // Filter by search text if provided
    if (text) {
      const searchLower = text.toLowerCase();
      filtered = filtered.filter(client => {
        return (
          client.name?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.phone?.toLowerCase().includes(searchLower) ||
          client.address?.toLowerCase().includes(searchLower) ||
          client.taxId?.toLowerCase().includes(searchLower) ||
          client.notes?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  };
/*
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setSearchText(text);
    setFilteredClients(filterClients(text, statusFilter));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    setFilteredClients(filterClients(searchText, status));
  };*/

  const columns = [
    { key: 'name', label: t('client.name') },
    { key: 'email', label: t('client.email') },
    { key: 'phone', label: t('client.phone') },
    { key: 'address', label: t('client.address') },
    { key: 'taxId', label: t('client.taxId') },
    {
      key: 'status',
      label: t('client.status'),
      render: (client: Client) => {
        // Define status colors that match the dashboard stats
        const statusColors = {
          'ACTIVE': 'bg-green-100 text-green-600',
          'INACTIVE': 'bg-red-100 text-red-600',
          'PENDING': 'bg-yellow-100 text-yellow-500'
        };

        const color = statusColors[client.status] || 'bg-gray-100 text-gray-800';

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {client.status}
          </span>
        );
      }
    }
  ];

  // Dashboard stats - using the filtered client to update stats based on filters
  const clientStats = [
    {
      label: t('client.activeClients'),
      icon: CheckCircleIcon,
      value: loading ? '-' : filteredClients.filter(c => c.status === 'ACTIVE').length,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: t('client.pendingClients'),
      icon: ClockIcon,
      value: loading ? '-' : filteredClients.filter(c => c.status === 'PENDING').length,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      label: t('client.inactiveClients'),
      icon: XCircleIcon,
      value: loading ? '-' : filteredClients.filter(c => c.status === 'INACTIVE').length,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      label: t('client.totalClients'),
      icon: UserGroupIcon,
      value: loading ? '-' : filteredClients.length,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    }
  ];

  return (
      <div className="space-y-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-4 flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
          ))}
        </div>

        {/* Client Inventory Section */}

        <div className="relative">
          {/* Client form modal */}
          <ClientFormModal
              show={showForm}
              onClose={handleFormCancel}
              onSubmit={handleFormSubmit}
              formData={formData}
              setFormData={setFormData}
              editingClient={editingClient}
          />

          {error && (
              <Notification
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
              />
          )}

          {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10 space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500">{t('client.loading')}</p>
              </div>
          )}
          <DataTable
              data={filteredClients}
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
            Add Client
          </span>
        </button>
      </div>
  );
}
