// Import the Express app configuration and the HTTP module
const app = require('./app');
const http = require('http');

// Set the server port from the environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Start the server listening on the specified port
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Export the server object for use in other modules
module.exports = server;