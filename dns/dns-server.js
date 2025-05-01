const dns = require('native-dns');
const server = dns.createServer();

server.on('request', function (request, response) {
  try {
    request.question.forEach((question) => {
      const hostname = question.name;
      console.log(`DNS Query for: ${hostname}`);

      if (hostname === 'myapp.local') {
        response.answer.push(dns.A({
          name: hostname,
          address: '192.168.137.1', // IP of your PC
          ttl: 600,
        }));
      }
    });

    response.send();
  } catch (err) {
    console.error('Error handling DNS request:', err);
    response.send(); // Send an empty response in case of error
  }
});

server.on('error', (err) => {
  console.error('DNS Server Error:', err);
});

server.on('listening', () => {
  console.log('DNS server is actively listening for requests.');
});

// Add global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// Use port 53 (requires elevated privileges) or fallback to 5353 for testing
const PORT = 5353; // Change to 53 if running with elevated privileges
try {
  server.serve(PORT, '0.0.0.0'); // Listen on all interfaces
  console.log(`DNS server running on port ${PORT}`);
} catch (err) {
  console.error('Failed to start DNS server:', err);
}

// Keep the event loop alive
setInterval(() => {}, 1000); // Prevent Node.js from exiting