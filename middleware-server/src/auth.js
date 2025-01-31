import { config } from './config.js';

export const validateApiKey = (req, res, next) => {
  const apiKey = req.get('x-api-key');
  
  if (!apiKey || apiKey !== config.apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};
