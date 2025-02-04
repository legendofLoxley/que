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
app.get('/apps', handleQuickbaseRequest('GET', '/apps'));
app.post('/apps', handleQuickbaseRequest('POST', '/apps'));
app.get('/apps/:appId', handleQuickbaseRequest('GET', '/apps/:appId'));
app.post('/apps/:appId', handleQuickbaseRequest('POST', '/apps/:appId')); // Update an app
app.delete('/apps/:appId', handleQuickbaseRequest('DELETE', '/apps/:appId'));
app.get('/apps/:appId/events', handleQuickbaseRequest('GET', '/apps/:appId/events')); // Get app events
app.post('/apps/:appId/copy', handleQuickbaseRequest('POST', '/apps/:appId/copy')); // Copy an app

// Tables endpoints
app.get('/tables', handleQuickbaseRequest('GET', '/tables'));
app.post('/tables', handleQuickbaseRequest('POST', '/tables'));
app.get('/tables/:tableId', handleQuickbaseRequest('GET', '/tables/:tableId'));
app.post('/tables/:tableId', handleQuickbaseRequest('POST', '/tables/:tableId'));
app.delete('/tables/:tableId', handleQuickbaseRequest('DELETE', '/tables/:tableId'));
// Table relationships
app.get('/tables/:tableId/relationships', handleQuickbaseRequest('GET', '/tables/:tableId/relationships'));
app.post('/tables/:tableId/relationship', handleQuickbaseRequest('POST', '/tables/:tableId/relationship'));
app.post('/tables/:tableId/relationship/:relationshipId', handleQuickbaseRequest('POST', '/tables/:tableId/relationship/:relationshipId'));
app.delete('/tables/:tableId/relationship/:relationshipId', handleQuickbaseRequest('DELETE', '/tables/:tableId/relationship/:relationshipId'));

// Files endpoints
app.get('/files/:tableId/:recordId/:fieldId/:versionNumber', handleQuickbaseRequest('GET', '/files/:tableId/:recordId/:fieldId/:versionNumber'));
app.delete('/files/:tableId/:recordId/:fieldId/:versionNumber', handleQuickbaseRequest('DELETE', '/files/:tableId/:recordId/:fieldId/:versionNumber'));

// Users endpoints
app.post('/users', handleQuickbaseRequest('POST', '/users'));
app.put('/users/deny', handleQuickbaseRequest('PUT', '/users/deny'));
app.put('/users/deny/:shouldDeleteFromGroups', handleQuickbaseRequest('PUT', '/users/deny/:shouldDeleteFromGroups'));
app.put('/users/undeny', handleQuickbaseRequest('PUT', '/users/undeny'));

// Fields endpoints
app.get('/fields', handleQuickbaseRequest('GET', '/fields'));
app.post('/fields', handleQuickbaseRequest('POST', '/fields'));
app.delete('/fields', handleQuickbaseRequest('DELETE', '/fields'));
app.get('/fields/:fieldId', handleQuickbaseRequest('GET', '/fields/:fieldId'));
app.post('/fields/:fieldId', handleQuickbaseRequest('POST', '/fields/:fieldId'));
app.get('/fields/usage', handleQuickbaseRequest('GET', '/fields/usage'));
app.get('/fields/usage/:fieldId', handleQuickbaseRequest('GET', '/fields/usage/:fieldId'));

// Records endpoints
app.post('/records/query', handleQuickbaseRequest('POST', '/records/query/'));
app.post('/records', handleQuickbaseRequest('POST', '/records/'));
app.delete('/records', handleQuickbaseRequest('DELETE', '/records/'));

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
