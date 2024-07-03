const config = require('./jest-puppeteer.config');

module.exports = {
  ...config,
  server: {
    ...config['server'],
    command: 'npm run serve --port 3003',
  },
};
