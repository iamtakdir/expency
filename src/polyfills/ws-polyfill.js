// Patch global object to handle ws package stream errors
// This helps avoid issues with WebSocket implementation in React Native
if (typeof global !== 'undefined') {
  // Only add these if they don't already exist
  if (!global.WebSocket) {
    global.WebSocket = require('react-native').WebSocket || {};
  }
  
  // Add stub implementations of Node's Stream that might be used by ws
  if (!global.process) {
    global.process = {
      env: {},
      version: '',
      versions: {
        node: '16.0.0', // fake version
      },
      cwd: () => '/',
      platform: 'react-native',
    };
  }
}

export default {};
