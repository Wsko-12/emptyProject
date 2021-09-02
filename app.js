const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;



http.listen(PORT, '0.0.0.0', () => {
  console.log('Сервер запущен');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/', express.static(__dirname + '/client'));
