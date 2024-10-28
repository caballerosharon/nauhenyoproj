const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use((err, req, res, next) => {
  console.error('An error occurred:', err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Catch unhandled errors and prevent crashing
process.on('uncaughtException', (err) => {
  console.error('Unhandled exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});