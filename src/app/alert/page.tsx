'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import DataTable from '@/components/common/DataTable';
import Notification from '@/components/common/Notification';
import { alertService, Alert } from '@/lib/api/alert';
import { commonStyles as styles } from '@/styles/commonStyles';

export default function AlertPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    message: '',
    type: 'info',
    status: 'active',
    priority: 'low'
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await alertService.getAll();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      setError(error instanceof Error ? error.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      title: alert.title,
      message: alert.message,
      type: alert.type,
      status: alert.status,
      priority: alert.priority
    });
    setShowForm(true);
  };
/*
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        setError(null);
        await alertService.delete(id);
        setAlerts(alerts.filter(alert => alert.id !== id));
      } catch (error) {
        console.error('Error deleting alert:', error);
        setError(error instanceof Error ? error.message : 'Failed to delete alert');
      }
    }
  };*/

  const handleAdd = () => {
    setEditingAlert(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      status: 'active',
      priority: 'low'
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (editingAlert) {
        const updatedAlert = await alertService.update(editingAlert.id, formData);
        setAlerts(alerts.map(alert => 
          alert.id === editingAlert.id ? updatedAlert : alert
        ));
      } else {
        const newAlert = await alertService.create(formData);
        setAlerts([...alerts, newAlert]);
      }
      setShowForm(false);
    } catch (error) {
      console.error('Error saving alert:', error);
      setError(error instanceof Error ? error.message : 'Failed to save alert');
    }
  };

/*
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'type', label: 'Type' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { 
      key: 'createdAt', 
      label: 'Created At',
      render: (alert: Alert) => {
        const date = new Date(alert.createdAt);
        const formattedDate = date.toISOString().split('T')[0]; // This will format as YYYY-MM-DD
        return (
          <span className="font-semibold text-gray-900">
            {formattedDate}
          </span>
        );
      }
    }
  ];*/

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Alert Management</h1>
          <button onClick={handleAdd} className={styles.addButton}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Alert
          </button>
        </div>

        {error && (
          <Notification message={error} type="error" onClose={() => setError(null)} />
        )}

        {showForm ? (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {editingAlert ? 'Edit Alert' : 'Add New Alert'}
              </h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className={styles.formBody}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.input}
                  placeholder="Enter alert title"
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Enter alert message"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Alert['type'] })}
                    className={styles.select}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="success">Success</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Alert['status'] })}
                    className={styles.select}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Alert['priority'] })}
                    className={styles.select}
                    required
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {editingAlert ? 'Update Alert' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner} />
              </div>
            )}
            <DataTable
              data={alerts}
              columns={[
                { 
                  key: 'title',
                  label: 'Title',
                  render: (alert: Alert) => (
                    <span className={styles.tableCell}>{alert.title}</span>
                  )
                },
                { key: 'type', label: 'Type' },
                { key: 'priority', label: 'Priority' },
                { key: 'status', label: 'Status' },
                { 
                  key: 'createdAt', 
                  label: 'Created At',
                  render: (alert: Alert) => {
                    const date = new Date(alert.createdAt);
                    const formattedDate = date.toISOString().split('T')[0]; // This will format as YYYY-MM-DD
                    return (
                      <span className={styles.tableSecondaryText}>
                        {formattedDate}
                      </span>
                    );
                  }
                }
              ]}
              onEdit={handleEdit}
              onDelete={()=>{}}
            />
          </div>
        )}
      </div>
    </Layout>
  );
} 