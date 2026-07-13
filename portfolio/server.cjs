const handler = require('./api/index.cjs');
const http = require('http');

const PORT = process.env.PORT || 3001;

const server = http.createServer(function(req, res) {
  handler(req, res);
});

server.listen(PORT, function() {
  console.log('API server running on http://localhost:' + PORT);
});
