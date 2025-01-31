import localtunnel from 'localtunnel';
import { config } from './src/config.js';

const TUNNELS = [
  { name: 'apps', subdomain: 'qb-apps' },
  { name: 'records', subdomain: 'qb-records' },
  { name: 'tables', subdomain: 'qb-tables' },
  { name: 'files', subdomain: 'qb-files' },
  { name: 'users', subdomain: 'qb-users' }
];

const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function createTunnel(tunnelConfig, retryCount = 0) {
  try {
    const tunnel = await localtunnel({ 
      port: config.port,
      subdomain: tunnelConfig.subdomain,
      // Keep connection alive
      maxRetries: 10,
      keepAlive: true
    });

    console.log(`Tunnel created for ${tunnelConfig.name}:`, tunnel.url);

    // Handle tunnel close
    tunnel.on('close', () => {
      console.log(`Tunnel for ${tunnelConfig.name} closed, attempting to reconnect...`);
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => createTunnel(tunnelConfig, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Max retries reached for ${tunnelConfig.name}. Please restart the tunnel manually.`);
      }
    });

    // Handle tunnel errors
    tunnel.on('error', err => {
      console.error(`Tunnel error for ${tunnelConfig.name}:`, err);
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => createTunnel(tunnelConfig, retryCount + 1), RETRY_DELAY);
      } else {
        console.error(`Max retries reached for ${tunnelConfig.name}. Please restart the tunnel manually.`);
      }
    });

    return tunnel;
  } catch (error) {
    console.error(`Failed to create tunnel for ${tunnelConfig.name}:`, error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ${tunnelConfig.name} in ${RETRY_DELAY/1000} seconds...`);
      setTimeout(() => createTunnel(tunnelConfig, retryCount + 1), RETRY_DELAY);
    } else {
      console.error(`Max retries reached for ${tunnelConfig.name}. Please restart the tunnel manually.`);
    }
  }
}

async function createAllTunnels() {
  try {
    const tunnelPromises = TUNNELS.map(tunnelConfig => createTunnel(tunnelConfig));
    await Promise.all(tunnelPromises);
    console.log('All tunnels created successfully');
  } catch (error) {
    console.error('Error creating tunnels:', error);
  }
}

// Start all tunnels
createAllTunnels();
