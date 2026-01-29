/* eslint-disable no-console */
require('colors');

/**
 * Custom logger with styled output
 */
const customLogger = {
  success: (message) => {
    console.log(`${`[SUCCESS]`.green.bold} ${message}`);
  },

  error: (message) => {
    console.log(`${`[FAILED]`.red.bold} ${message}`);
  },

  info: (message) => {
    console.log(`${`[INFO]`.blue.bold} ${message}`);
  },

  warning: (message) => {
    console.log(`${`[WARNING]`.yellow.bold} ${message}`);
  },

  service: (serviceName, status, details = '') => {
    if (status === 'connected' || status === 'started') {
      console.log(
        `${`[SUCCESS]`.green.bold} ${serviceName} ${status}${details ? ` - ${details}` : ''}`
      );
    } else if (status === 'failed' || status === 'error') {
      console.log(
        `${`[FAILED]`.red.bold} ${serviceName} ${status}${details ? ` - ${details}` : ''}`
      );
    } else {
      console.log(
        `${`[INFO]`.blue.bold} ${serviceName} ${status}${details ? ` - ${details}` : ''}`
      );
    }
  },

  route: (method, path, status = 'loaded') => {
    console.log(`${`[ROUTE]`.cyan.bold} ${method} ${path} - ${status}`);
  },

  middleware: (name, status = 'loaded') => {
    console.log(`${`[MIDDLEWARE]`.magenta.bold} ${name} - ${status}`);
  },

  database: (operation, status, details = '') => {
    if (status === 'success') {
      console.log(
        `${`[DATABASE]`.green.bold} ${operation} - success${details ? ` - ${details}` : ''}`
      );
    } else if (status === 'error') {
      console.log(
        `${`[DATABASE]`.red.bold} ${operation} - error${details ? ` - ${details}` : ''}`
      );
    } else {
      console.log(
        `${`[DATABASE]`.blue.bold} ${operation} - ${status}${details ? ` - ${details}` : ''}`
      );
    }
  },
};

module.exports = customLogger;
