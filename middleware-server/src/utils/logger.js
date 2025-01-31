import winston from 'winston';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    // Console logging
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File logging - separate files for different log levels
    new winston.transports.File({
      filename: resolve(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: resolve(__dirname, '../../logs/combined.log')
    })
  ]
});

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    headers: {
      'x-api-key': '***', // Mask sensitive data
      ...req.headers
    },
    query: req.query,
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const responseTime = Date.now() - start;
    
    logger.info('Outgoing response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
      body
    });

    return originalJson.call(this, body);
  };

  next();
};

// Error logging
export const errorLogger = (err, req, res, next) => {
  logger.error('Error occurred', {
    method: req.method,
    url: req.url,
    error: {
      message: err.message,
      stack: err.stack,
      status: err.status || 500
    }
  });

  next(err);
};

// Performance logging
export const performanceLogger = {
  logQuickbaseRequest: (config) => {
    logger.info('Quickbase request', {
      method: config.method,
      url: config.url,
      params: config.params
    });
  },
  
  logQuickbaseResponse: (response, duration) => {
    logger.info('Quickbase response', {
      status: response.status,
      duration,
      data: response.data
    });
  },
  
  logQuickbaseError: (error) => {
    logger.error('Quickbase request failed', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }
};

export default logger;
