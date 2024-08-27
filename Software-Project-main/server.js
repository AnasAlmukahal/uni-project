
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500' // Replace with your frontend's URL
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://tester:test123@soproject.3pk21.mongodb.net/university')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes
app.get('/api/collections', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not established');
    res.status(500).send('MongoDB connection is not established');
    return;
  }

  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Sending collections:', collectionNames);
    res.json(collectionNames);
  } catch (err) {
    console.error('Error retrieving collections:', err);
    res.status(500).send('Error retrieving collections');
  }
});

app.get('/api/collection-data/:name', async (req, res) => {
  const collectionName = req.params.name;
  console.log(`Received request for collection: ${collectionName}`);
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const documents = await collection.find({}).toArray();
    console.log(`Found ${documents.length} documents in ${collectionName}`);
    res.json(documents);
  } catch (err) {
    console.error('Error retrieving collection data:', err);
    res.status(500).send('Error retrieving collection data');
  }
});

app.post('/api/collection-data/:name', async (req, res) => {
  const collectionName = req.params.name;
  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).send('Error saving document');
  }
});

// Serve static files
app.use(express.static(__dirname));

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

 

  socket.on('newCollection', (collectionName) => {
    console.log('New collection added:', collectionName);
    io.emit('updateCollections'); // Notify all clients to fetch updated collections
  });
});

const PORT = 5500;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
