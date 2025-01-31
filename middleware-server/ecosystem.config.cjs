module.exports = {
  apps: [{
    name: 'middleware-server',
    script: 'src/index.js',
    type: 'module',
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    }
  }, {
    name: 'tunnels',
    script: 'tunnel.js',
    type: 'module',
    watch: false,
    max_restarts: 10,
    restart_delay: 5000,
    env: {
      NODE_ENV: 'development'
    },
    // Ensure tunnels restart together to maintain consistency
    kill_timeout: 3000,
    wait_ready: true,
    listen_timeout: 10000
  }]
};
