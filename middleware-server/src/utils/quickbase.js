import axios from 'axios';
import { config } from '../config.js';
import { performanceLogger } from './logger.js';

const quickbaseClient = axios.create({
  baseURL: 'https://api.quickbase.com',
  headers: {
    'QB-Realm-Hostname': config.quickbase.realmHostname,
    'Authorization': `QB-USER-TOKEN ${config.quickbase.userToken}`,
    'Content-Type': 'application/json',
    'User-Agent': 'QB-Middleware/1.0'
  }
});

export const handleQuickbaseRequest = (method, path) => async (req, res) => {
  try {
    // Replace path parameters
    let finalPath = path;
    if (req.params) {
      Object.keys(req.params).forEach(param => {
        finalPath = finalPath.replace(`:${param}`, req.params[param]);
      });
    }

    const config = {
      method,
      url: finalPath,
      data: method !== 'GET' ? req.body : undefined,
      params: req.query
    };

    // Log request
    performanceLogger.logQuickbaseRequest(config);

    const startTime = Date.now();
    const response = await quickbaseClient(config);
    const duration = Date.now() - startTime;

    // Log response
    performanceLogger.logQuickbaseResponse(response, duration);

    // Special handling for file downloads
    if (finalPath.startsWith('/v1/files') && method === 'GET') {
      // Get filename from Content-Disposition header if present
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'download';

      // Set response headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      
      // Return base64 content directly
      return res.send(Buffer.from(response.data, 'base64'));
    }

    res.json(response.data);
  } catch (error) {
    performanceLogger.logQuickbaseError(error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal server error'
    });
  }
};
