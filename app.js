// Import the Express module
import express from 'express';

// Create an Express application
const app = express();

// Define the port number
const port = 3000;

// Define a route handler for the default home page
app.get('/', (req, res) => {
  res.send('Hello, World 3!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
