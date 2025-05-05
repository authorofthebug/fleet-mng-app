'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { get } from '@/lib/api/base';

export default function ApiTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [serverInfo, setServerInfo] = useState<string>('');

  const testServerConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult('');
      setServerInfo('');

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      console.log('Testing server connection to:', baseUrl);

      // Test server connection
      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      const info = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        baseUrl,
        env: {
          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
        }
      };

      console.log('Server info:', info);
      setServerInfo(JSON.stringify(info, null, 2));

      // Try to get response body if available
      try {
        const text = await response.text();
        if (text) {
          setResult(text);
        }
      } catch (e) {
        console.error(e);
        console.log('No response body available');
      }
    } catch (error) {
      console.error('Server connection error:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async (endpoint: string) => {
    try {
      setLoading(true);
      setError(null);
      setResult('');
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const fullUrl = `${baseUrl}${endpoint}`;
      console.log('Testing endpoint:', fullUrl);

      const response = await get(endpoint);
      console.log('Response:', response);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Test error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">API Test Page</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Server Connection</h2>
              <div className="mt-2">
                <button
                  onClick={testServerConnection}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  Test Server Connection
                </button>
              </div>
              {serverInfo && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
                  <h3 className="text-sm font-medium text-gray-900">Server Info</h3>
                  <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{serverInfo}</pre>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">Test Endpoints</h2>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => testEndpoint('/api/roles')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  Test Roles
                </button>
                <button
                  onClick={() => testEndpoint('/api/agencies')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  Test Agencies
                </button>
                <button
                  onClick={() => testEndpoint('/api/positions')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  Test Positions
                </button>
                <button
                  onClick={() => testEndpoint('/api/employees')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  Test Employees
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-gray-900">Response</h3>
                <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 