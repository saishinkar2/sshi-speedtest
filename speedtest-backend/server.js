const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.raw({ limit: '20mb' })); // To handle raw binary upload

// Download endpoint: serve a fixed-size file (5MB random data)
app.get('/download', (req, res) => {
  const size = 5 * 1024 * 1024; // 5MB
  const buffer = Buffer.alloc(size, 'a'); // 5MB of 'a'
  res.set('Content-Type', 'application/octet-stream');
  res.send(buffer);
});

// Upload endpoint: accept POST upload data and respond
app.post('/upload', (req, res) => {
  // You can log size or content if needed
  res.sendStatus(200);
});

// Ping endpoint: simple response
app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Speed test backend running on http://localhost:${PORT}`);
});
