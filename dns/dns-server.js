const dns = require('native-dns');
const server = dns.createServer();

server.on('request', function (request, response) {
  const hostname = request.question[0].name;
  if (hostname === 'myapp.local') {
    response.answer.push(dns.A({
      name: hostname,
      address: '192.168.137.1',  // IP of your PC
      ttl: 600,
    }));
  }
  response.send();
});

server.on('error', (err) => {
  console.error('DNS Server Error:', err);
});

server.serve(53, '0.0.0.0');  // Listen on all interfaces
console.log('DNS server running on port 53');
