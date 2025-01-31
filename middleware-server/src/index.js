import express from 'express';
import cors from 'cors';
import { validateApiKey } from './auth.js';
import { handleQuickbaseRequest } from './utils/quickbase.js';
import { config } from './config.js';
import { requestLogger, errorLogger } from './utils/logger.js';

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());
app.use(requestLogger); // Add request logging
app.use(validateApiKey);

// Apps endpoints
app.get('/apps', handleQuickbaseRequest('GET', '/v1/apps'));
app.post('/apps', handleQuickbaseRequest('POST', '/v1/apps'));
app.get('/apps/:appId', handleQuickbaseRequest('GET', '/v1/apps/:appId'));
app.post('/apps/:appId', handleQuickbaseRequest('POST', '/v1/apps/:appId')); // Update an app
app.delete('/apps/:appId', handleQuickbaseRequest('DELETE', '/v1/apps/:appId'));
app.get('/apps/:appId/events', handleQuickbaseRequest('GET', '/v1/apps/:appId/events')); // Get app events
app.post('/apps/:appId/copy', handleQuickbaseRequest('POST', '/v1/apps/:appId/copy')); // Copy an app

// Tables endpoints
app.get('/tables', handleQuickbaseRequest('GET', '/v1/tables'));
app.post('/tables', handleQuickbaseRequest('POST', '/v1/tables'));
app.get('/tables/:tableId', handleQuickbaseRequest('GET', '/v1/tables/:tableId'));
app.post('/tables/:tableId', handleQuickbaseRequest('POST', '/v1/tables/:tableId'));
app.delete('/tables/:tableId', handleQuickbaseRequest('DELETE', '/v1/tables/:tableId'));
// Table relationships
app.get('/tables/:tableId/relationships', handleQuickbaseRequest('GET', '/v1/tables/:tableId/relationships'));
app.post('/tables/:tableId/relationship', handleQuickbaseRequest('POST', '/v1/tables/:tableId/relationship'));
app.post('/tables/:tableId/relationship/:relationshipId', handleQuickbaseRequest('POST', '/v1/tables/:tableId/relationship/:relationshipId'));
app.delete('/tables/:tableId/relationship/:relationshipId', handleQuickbaseRequest('DELETE', '/v1/tables/:tableId/relationship/:relationshipId'));

// Files endpoints
app.get('/files/:tableId/:recordId/:fieldId/:versionNumber', handleQuickbaseRequest('GET', '/v1/files/:tableId/:recordId/:fieldId/:versionNumber'));
app.delete('/files/:tableId/:recordId/:fieldId/:versionNumber', handleQuickbaseRequest('DELETE', '/v1/files/:tableId/:recordId/:fieldId/:versionNumber'));

// Users endpoints
app.post('/users', handleQuickbaseRequest('POST', '/v1/users'));
app.put('/users/deny', handleQuickbaseRequest('PUT', '/v1/users/deny'));
app.put('/users/deny/:shouldDeleteFromGroups', handleQuickbaseRequest('PUT', '/v1/users/deny/:shouldDeleteFromGroups'));
app.put('/users/undeny', handleQuickbaseRequest('PUT', '/v1/users/undeny'));

// Fields endpoints
app.get('/fields', handleQuickbaseRequest('GET', '/v1/fields'));
app.post('/fields', handleQuickbaseRequest('POST', '/v1/fields'));
app.get('/fields/:fieldId', handleQuickbaseRequest('GET', '/v1/fields/:fieldId'));
app.post('/fields/:fieldId', handleQuickbaseRequest('POST', '/v1/fields/:fieldId'));

// Records endpoints
app.post('/records/query', handleQuickbaseRequest('POST', '/v1/records/query/'));
app.post('/records', handleQuickbaseRequest('POST', '/v1/records/'));
app.delete('/records', handleQuickbaseRequest('DELETE', '/v1/records/'));

// Error handling middleware
app.use(errorLogger);
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

app.listen(port, () => {
  console.log(`Middleware server running on port ${port}`);
});
