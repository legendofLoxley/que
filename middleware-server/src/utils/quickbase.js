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

    res.json(response.data);
  } catch (error) {
    performanceLogger.logQuickbaseError(error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Internal server error'
    });
  }
};
