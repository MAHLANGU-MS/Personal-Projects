const http = require('http');

// Try to create a server on port 3000
const server1 = http.createServer();
server1.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 3000 is in use');
  } else {
    console.log('Error on port 3000:', e.message);
  }
});

server1.on('listening', () => {
  console.log('Port 3000 is available');
  server1.close();
});

server1.listen(3000);

// Try to create a server on port 3002
const server2 = http.createServer();
server2.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 3002 is in use');
  } else {
    console.log('Error on port 3002:', e.message);
  }
});

server2.on('listening', () => {
  console.log('Port 3002 is available');
  server2.close();
});

server2.listen(3002);
