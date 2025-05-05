'use client';

import { useState } from 'react';
import { get } from '@/lib/api/base';

const endpoints = [
  '/api/roles',
  '/api/employees',
  '/api/companies',
  '/api/clients',
  '/api/vehicles',
  '/api/contracts',
  '/api/insurance',
  '/api/maintenance',
  '/api/permit',
  '/api/tariff',
  '/api/health'
];

type EndpointResult = {
  status: string;
  data: string | null;
  error: string | null;
};

export default function ApiDiagnostic() {
  const [results, setResults] = useState<Record<string, EndpointResult>>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const data = await get(endpoint);
      setResults(prev => ({
        ...prev,
        [endpoint]: { 
          status: 'success', 
          data: JSON.stringify(data, null, 2), 
          error: null 
        }
      }));
    } catch (error) {
      console.error(`Error testing endpoint ${endpoint}:`, error);
      setResults(prev => ({
        ...prev,
        [endpoint]: { 
          status: 'error', 
          data: null, 
          error: error instanceof Error ? error.message : String(error) 
        }
      }));
    }
  };

  const testAllEndpoints = async () => {
    setLoading(true);
    setResults({});
    
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
    
    setLoading(false);
  };

  const testEndpointIndividually = (endpoint: string) => {
    setResults(prev => ({
      ...prev,
      [endpoint]: { status: 'loading', data: null, error: null }
    }));
    testEndpoint(endpoint);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">API Diagnostic</h2>
      
      <div className="mb-4">
        <button
          onClick={testAllEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test All Endpoints'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {endpoints.map(endpoint => (
          <div key={endpoint} className="border rounded p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{endpoint}</h3>
              <button
                onClick={() => testEndpointIndividually(endpoint)}
                disabled={loading}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
              >
                Test
              </button>
            </div>
            
            {results[endpoint] && (
              <div className={`mt-2 p-2 rounded ${
                results[endpoint].status === 'success' ? 'bg-green-100' :
                results[endpoint].status === 'error' ? 'bg-red-100' :
                'bg-gray-100'
              }`}>
                <div className="font-medium">
                  Status: {results[endpoint].status}
                </div>
                
                {results[endpoint].error && (
                  <div className="text-red-600 text-sm mt-1">
                    {results[endpoint].error}
                  </div>
                )}
                
                {results[endpoint].data && (
                  <div className="mt-2 text-sm overflow-auto max-h-40">
                    <pre>{results[endpoint].data}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 