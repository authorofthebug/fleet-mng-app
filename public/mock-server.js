// Simple mock server for testing API endpoints
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8385;
const MOCK_DATA_DIR = path.join(__dirname, 'mock-data');

// Create mock data directory if it doesn't exist
if (!fs.existsSync(MOCK_DATA_DIR)) {
  fs.mkdirSync(MOCK_DATA_DIR);
}

// Default mock data
const defaultData = {
  roles: [
    { id: 1, name: 'Admin', description: 'Administrator', permissions: ['all'] },
    { id: 2, name: 'User', description: 'Regular user', permissions: ['read'] }
  ],
  employees: [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123-456-7890', agencyId: 1, positionId: 1, roleId: 1 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '098-765-4321', agencyId: 1, positionId: 2, roleId: 2 }
  ],
  companies: [
    { id: 1, name: 'Acme Corp', address: '123 Main St', phone: '555-123-4567', email: 'info@acme.com', website: 'www.acme.com' },
    { id: 2, name: 'Globex Inc', address: '456 Oak Ave', phone: '555-987-6543', email: 'contact@globex.com', website: 'www.globex.com' }
  ],
  clients: [
    { id: 1, name: 'Client A', email: 'clienta@example.com', phone: '111-222-3333', address: '789 Pine St', company: 'Acme Corp', status: 'active', type: 'corporate', notes: 'VIP client', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 2, name: 'Client B', email: 'clientb@example.com', phone: '444-555-6666', address: '321 Elm St', company: 'Globex Inc', status: 'active', type: 'individual', notes: 'New client', createdAt: '2023-02-01', updatedAt: '2023-02-01' }
  ],
  vehicles: [
    { id: 1, brand: 'Toyota', model: 'Camry', licensePlate: 'ABC123', status: 'active', type: 'Sedan', year: 2020, lastMaintenance: '2023-01-15', nextMaintenance: '2023-07-15' },
    { id: 2, brand: 'Honda', model: 'CR-V', licensePlate: 'XYZ789', status: 'active', type: 'SUV', year: 2021, lastMaintenance: '2023-02-20', nextMaintenance: '2023-08-20' }
  ],
  contracts: [
    { id: 1, title: 'Lease Agreement', description: 'Vehicle lease contract', startDate: '2023-01-01', endDate: '2023-12-31', status: 'active', type: 'lease', value: 12000, clientId: 1, vehicleId: 1, terms: 'Standard terms apply', documents: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 2, title: 'Service Contract', description: 'Maintenance service agreement', startDate: '2023-02-01', endDate: '2023-12-31', status: 'active', type: 'service', value: 5000, clientId: 2, vehicleId: 2, terms: 'Quarterly service included', documents: [], createdAt: '2023-02-01', updatedAt: '2023-02-01' }
  ],
  insurance: [
    { id: '1', vehicleId: '1', provider: 'SafeDrive Insurance', policyNumber: 'POL123456', startDate: '2023-01-01', endDate: '2023-12-31', coverage: 'Comprehensive', premium: 1200, status: 'active', documents: [], createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: '2', vehicleId: '2', provider: 'SecureAuto Insurance', policyNumber: 'POL789012', startDate: '2023-02-01', endDate: '2023-12-31', coverage: 'Comprehensive', premium: 1500, status: 'active', documents: [], createdAt: '2023-02-01', updatedAt: '2023-02-01' }
  ],
  maintenance: [
    { id: 1, vehicleId: 1, type: 'preventive', description: 'Regular oil change', date: '2023-01-15', cost: 50, status: 'completed', provider: 'AutoCare', documents: [], notes: 'Next service due in 6 months', createdAt: '2023-01-15', updatedAt: '2023-01-15' },
    { id: 2, vehicleId: 2, type: 'inspection', description: 'Annual safety inspection', date: '2023-02-20', cost: 75, status: 'completed', provider: 'SafetyFirst', documents: [], notes: 'All systems checked', createdAt: '2023-02-20', updatedAt: '2023-02-20' }
  ],
  permit: [
    { id: 1, vehicleId: 1, type: 'registration', number: 'REG123456', issueDate: '2023-01-01', expiryDate: '2023-12-31', status: 'active', issuingAuthority: 'DMV', documents: [], notes: 'Annual registration', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 2, vehicleId: 2, type: 'registration', number: 'REG789012', issueDate: '2023-02-01', expiryDate: '2023-12-31', status: 'active', issuingAuthority: 'DMV', documents: [], notes: 'Annual registration', createdAt: '2023-02-01', updatedAt: '2023-02-01' }
  ],
  tariff: [
    { id: 1, name: 'Standard Rate', description: 'Standard hourly rate', rate: 50, currency: 'USD', type: 'hourly', status: 'active', startDate: '2023-01-01', endDate: '2023-12-31', conditions: 'Minimum 1 hour', createdAt: '2023-01-01', updatedAt: '2023-01-01' },
    { id: 2, name: 'Premium Rate', description: 'Premium daily rate', rate: 200, currency: 'USD', type: 'daily', status: 'active', startDate: '2023-01-01', endDate: '2023-12-31', conditions: 'Minimum 1 day', createdAt: '2023-01-01', updatedAt: '2023-01-01' }
  ]
};

// Initialize mock data files if they don't exist
Object.keys(defaultData).forEach(key => {
  const filePath = path.join(MOCK_DATA_DIR, `${key}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData[key], null, 2));
  }
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true'
};

// Create server
const server = http.createServer((req, res) => {
  // Add CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

  // Health check endpoint
  if (parsedUrl.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // API endpoints
  if (pathSegments[0] === 'api') {
    let resource = pathSegments[1];
    const id = pathSegments[2];
    const subResource = pathSegments[3];
    const subId = pathSegments[4];

    console.log(`Request for resource: ${resource}, id: ${id}, subResource: ${subResource}, subId: ${subId}`);
    console.log(`Full URL: ${req.url}`);

    // Special case for vehicle endpoint
    if (resource === 'vehicles') {
      console.log('Handling vehicle endpoint');
      // Use the vehicle data directly
      const vehiclesData = defaultData.vehicles;

      if (req.method === 'GET') {
        if (!id) {
          // GET all vehicle
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(vehiclesData));
          return;
        } else {
          // GET vehicle by ID
          const vehicle = vehiclesData.find(v => v.id.toString() === id);
          if (!vehicle) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Vehicle not found' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(vehicle));
          return;
        }
      }
    }

    // Handle plural/singular resource names for other resources
    const resourceMappings = {
      'clients': 'client',
      'contracts': 'contract',
      'employees': 'employee',
      'permits': 'permit',
      'maintenances': 'maintenance',
      'insurances': 'insurance',
      'tariffs': 'tariff'
    };

    // Check if we need to map a plural resource name to singular
    if (resourceMappings[resource]) {
      console.log(`Mapping plural resource '${resource}' to singular '${resourceMappings[resource]}'`);
      resource = resourceMappings[resource];
    }

    // Handle file uploads and document operations
    if (subResource === 'documents' || resource === 'documents') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ url: 'https://example.com/mock-document.pdf' }));
      return;
    }

    // Handle main resource operations
    const filePath = path.join(MOCK_DATA_DIR, `${resource}.json`);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Resource not found' }));
      return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // GET all
    if (req.method === 'GET' && !id) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
      return;
    }

    // GET by ID
    if (req.method === 'GET' && id) {
      const item = data.find(item => item.id.toString() === id);
      if (!item) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
      return;
    }

    // POST (create)
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const newItem = JSON.parse(body);
          newItem.id = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
          newItem.createdAt = new Date().toISOString();
          newItem.updatedAt = new Date().toISOString();
          data.push(newItem);
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newItem));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
      return;
    }

    // PUT (update)
    if (req.method === 'PUT' && id) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const updates = JSON.parse(body);
          const index = data.findIndex(item => item.id.toString() === id);
          if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found' }));
            return;
          }
          data[index] = { ...data[index], ...updates, id: data[index].id, updatedAt: new Date().toISOString() };
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data[index]));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
      return;
    }

    // DELETE
    if (req.method === 'DELETE' && id) {
      const index = data.findIndex(item => item.id.toString() === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
        return;
      }
      data.splice(index, 1);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.writeHead(204);
      res.end();
      return;
    }
  }

  // Default response for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/health');
  Object.keys(defaultData).forEach(key => {
    console.log(`  GET    /api/${key}`);
    console.log(`  GET    /api/${key}/:id`);
    console.log(`  POST   /api/${key}`);
    console.log(`  PUT    /api/${key}/:id`);
    console.log(`  DELETE /api/${key}/:id`);
  });
});