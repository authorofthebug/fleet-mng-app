'use client';

import { useState, useEffect} from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import {Contract, contractService} from '@/lib/api/contract';
import {Client, clientService} from '@/lib/api/client';
import {Employee, employeeService} from '@/lib/api/employee';

export default function ContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Contract, 'id'>>({
    title: '',
    description: '',
    startDate: 'string',
    endDate: 'string',
    status: 'active',
    type: 'lease',
    value: 0,
    clientId: 0,
    vehicleId: 0,
    terms: '1',
    documents: [],
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contractsData, clientsData, employeesData] = await Promise.all([
        contractService.getAll(),
        clientService.getAll(),
        employeeService.getAll()
      ]);
      setContracts(contractsData);
      setClients(clientsData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contract: Contract) => {
    setFormData({
      clientId: contract.clientId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      status: contract.status,
      documents: contract.documents,
      title: '',
      description: '',
      type: 'lease',
      value: 0,
      vehicleId: 0,
      terms: '1',
      createdAt: '',
      updatedAt: ''
    });
    setShowForm(true);
  };

  /*const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
         await contractService.delete(parseInt(id));
        setContracts(contracts.filter(contract => contract.id !== parseInt(id)));
      } catch (err) {
        setError('Failed to delete contract');
        console.error('Error deleting contract:', err);
      }
    }
  };*/

  const handleAdd = () => {
    setFormData({
      clientId: 0,
      startDate: 'contract.startDate',
      endDate: 'contract.endDate',
      status: 'active',
      documents: [],
      title: '',
      description: '',
      type: 'lease',
      value: 0,
      vehicleId: 0,
      terms: '1',
      createdAt: '',
      updatedAt: ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     /* if (formData.id) {
        const updatedContract = await contractService.update(formData.id, formData);
        setContracts(contracts.map(contract =>
            contract.id === formData.id ? updatedContract : contract
        ));
      } else {
        const newContract = await contractService.create(formData);
        setContracts([...contracts, newContract]);
      }*/
      setShowForm(false);
    } catch (err) {
      setError('Failed to save contract');
      console.error('Error saving contract:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      //const uploadedUrl = await contractService.uploadDocument(1, formData);
      /*setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, uploadedUrl]
      }));*/
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    }
  };
/*
  const handleRemoveDocument = async (documentUrl: string) => {
    try {
      await contractService.removeDocument(1, documentUrl);
      setFormData(prev => ({
        ...prev,
        documents: prev.documents.filter((url: string) => url !== documentUrl)
      }));
    } catch (err) {
      setError('Failed to remove document');
      console.error('Error removing document:', err);
    }
  };*/

  const columns = [
    {key: 'clientId', label: 'Client'},
    {key: 'employeeId', label: 'Employee'},
    {key: 'startDate', label: 'Start Date'},
    {key: 'endDate', label: 'End Date'},
    {key: 'status', label: 'Status'},
    {key: 'menu', label: 'Actions'}
  ];

  return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Contracts</h1>
            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Contract
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
                    {formData.clientId ? 'Edit Contract' : 'Add Contract'}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Client
                      </label>
                      <select
                          value={formData.clientId}
                          onChange={(e) => setFormData({...formData, clientId: parseInt(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                      >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Employee
                      </label>
                      <select
                          value={formData.clientId}
                          onChange={(e) => setFormData({...formData,clientId: parseInt(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                      >
                        <option value="">Select Employee</option>
                        {employees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                              {`${employee.firstName} ${employee.lastName}`}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, status: e.target.value as Contract['status']})}
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
          data={contracts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={()=>{}}
          loading={loading}
        />
      </div>
    </Layout>
  );
} 