'use client';

import { useState } from 'react';
import { get } from '@/lib/api/base';
import { roleService, Role } from '@/lib/api/role';
import { companyService, Company } from '@/lib/api/company';
import { employeeService, Employee } from '@/lib/api/employee';

type ApiResult = {
  roles?: Role[];
  companies?: Company[];
  employees?: Employee[];
  [key: string]: unknown;
};

export default function ApiTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [endpoint, setEndpoint] = useState('/api/roles');

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API endpoint:', endpoint);
      const data = await get(endpoint);
      console.log('API response:', data);
      setResult({ [endpoint]: data });
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const testLoadData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing loadData with Promise.all');
      const [roles, companies, employees] = await Promise.all([
        roleService.getAll(),
        companyService.getAll(),
        employeeService.getAll()
      ]);
      
      console.log('loadData response:', { roles, companies, employees });
      setResult({ roles, companies, employees });
    } catch (err) {
      console.error('loadData error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">API Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Endpoint:</label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        <button
          onClick={testLoadData}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test loadData'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="p-3 bg-gray-100 rounded overflow-auto max-h-60">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 