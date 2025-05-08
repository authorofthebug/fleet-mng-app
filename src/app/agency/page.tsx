'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { agencyService, Agency } from '@/lib/api/agency';
import { commonStyles as styles } from '@/styles/commonStyles';

interface Company {
  id: number;
  name: string;
  agencies?: Agency[];
}

export default function AgencyPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [companies] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [loading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Agency, 'id'>>({
    name: '',
    company: null,
    employees: [],
    employeeCount:1,
    status: 'active'
  });
/*
  const loadCompanies = async () => {
    try {
      const response = await fetch('http://localhost:8385/api/companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const data = await response.json();
      setCompanies(data);
      return data;
    } catch (error) {
      console.error('Error loading companies:', error);
      setError(error instanceof Error ? error.message : 'Failed to load companies');
      return [];
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [agenciesData, companiesData] = await Promise.all([
        agencyService.getAll(),
        loadCompanies()
      ]);
      setAgencies(agenciesData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, );
*/
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company) {
      setError('Please select a company');
      return;
    }

    try {
      setError(null);
      if (editingAgency) {
        const updatedAgency = await agencyService.update(editingAgency.id, formData);
        setAgencies(agencies.map(agency => 
          agency.id === editingAgency.id ? updatedAgency : agency
        ));
      } else {
        const newAgency = await agencyService.create(formData);
        setAgencies([...agencies, newAgency]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving agency:', error);
      setError(error instanceof Error ? error.message : 'Failed to save agency');
    }
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      try {
        setError(null);
        await agencyService.delete(id);
        setAgencies(agencies.filter(agency => agency.id !== id));
        // Show success notification
        setError('Agency deleted successfully');
        setTimeout(() => setError(null), 3000); // Clear the success message after 3 seconds
      } catch (error) {
        console.error('Error deleting agency:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete agency');
      }
    }
  };*/

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (agency: Agency) => (
        <span className={styles.tableCell}>{agency.name}</span>
      )
    },
    { 
      key: 'company', 
      label: 'Company',
      render: (agency: Agency) => (
        <span className={styles.tableCell}>{agency.company?.name || 'No Company'}</span>
      )
    },
    { 
      key: 'employees', 
      label: 'Employees',
      render: (agency: Agency) => (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          {agency.employees?.length || 0}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (agency: Agency) => {
        const status = agency.status || 'pending';
        const statusStyles = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    }
  ];

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Agency Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your agencies and their assignments
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAgency(null);
              setFormData({
                name: '',
                employeeCount:1,
                company: null,
                employees: [],
                status: 'active'
              });
              setShowForm(true);
            }}
            className={styles.addButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Agency
          </button>
        </div>

        {error && (
          <Notification message={error} type="error" onClose={() => setError(null)} />
        )}

        {showForm ? (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {editingAgency ? 'Edit Agency' : 'Add New Agency'}
              </h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className={styles.formBody}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>Agency Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter agency name"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="company" className={styles.label}>Company</label>
                <select
                    className={styles.formInput}
                    value={formData.company?.id || ''}
                    onChange={e => {
                      const companyId = Number(e.target.value);
                      const company = companies.find(c => c.id === companyId) || null;
                      setFormData({
                        ...formData,
                        company: company
                            ? { ...company, agencies: company.agencies ?? [] }
                            : null
                      });
                    }}
                    required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="status" className={styles.label}>Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" | "pending" })}
                  className="form-select"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
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
                  {editingAgency ? 'Update Agency' : 'Create Agency'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <DataTable
              data={agencies}
              columns={columns}
              onEdit={(agency) => {
                setEditingAgency(agency);
                setFormData({
                  name: agency.name,
                  company: agency.company,
                  employeeCount: 1,
                  employees: agency.employees,
                  status: agency.status || 'active'
                });
                setShowForm(true);
              }}
              onDelete={()=>{}}
              loading={loading}
            />
          </div>
        )}

        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner} />
          </div>
        )}
      </div>
    </Layout>
  );
} 