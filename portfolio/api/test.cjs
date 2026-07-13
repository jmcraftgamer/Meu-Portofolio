module.exports = function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ message: 'API CJS funcionando!' }));
};
