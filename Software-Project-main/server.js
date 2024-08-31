const express = require('express');
const mongoose = require('mongoose');

const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type'],  
  credentials: true 
}));

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500' 
  }
});
const feedbackSchema = new mongoose.Schema({
  documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Document' 
  },
  feedbackText: {
      type: String,
      required: true
  },
  submittedBy: {
      type: String,
      required: true
  },
  submittedAt: {
      type: Date,
      default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

mongoose.connect('mongodb+srv://tester:test123@soproject.3pk21.mongodb.net/university')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  
async function getDataFromDatabase(collectionName) {
  const collection = db.collection(collectionName);
  const data = await collection.find({}).toArray();
  const filteredData = data.reduce((acc, item) => {

    const { number, section, ...rest } = item;


    if (rest.value && typeof rest.value === 'number') {

      acc[rest.category] = rest.value;
        }

  return acc;
    }, {});

    return filteredData;
}


app.get('/api/kpi/:collectionName', async (req, res) => {
    console.log('received request for kpi data');
    const collectionName = req.params.collectionName;
    console.log(`Request for KPI data from collection: ${collectionName}`);
  
    try {
      const collection = mongoose.connection.db.collection(collectionName);
  
      const startTime = Date.now();
      const documents = await collection.find({}).toArray();
      const collectionRetrievalTime = Date.now() - startTime;
      const documentFetchTime = collectionRetrievalTime / documents.length;
      const formSubmissionRate = (documents.length / 100) * 100;
      const apiErrorRate = 2;
  
      const kpiData = {
        collectionRetrievalTime,
        documentFetchTime,
        formSubmissionRate,
        apiErrorRate
      };
  
      console.log('Sending KPI data:', kpiData);
      res.json(kpiData);
    } catch (error) {
      console.error('Error calculating KPI:', error);
      res.status(500).json({ error: 'Failed to calculate KPI' });
    }
  });
  
  app.get('/api/graph/:collectionName', async (req, res) => {
    const collectionName = req.params.collectionName;

    try {
        const collection = mongoose.connection.db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        const processedData = {};
        documents.forEach(doc => {
            for (let key in doc) {
                if (typeof doc[key] === 'number') {
                    if (!processedData[key]) {
                        processedData[key] = 0;
                    }
                    processedData[key] += doc[key];
                }
            }
        });

        res.json(processedData); 
    } catch (error) {
        console.error('Error generating graph data:', error);
        res.status(500).json({ error: 'Failed to generate graph data' });
    }
});

function filterData(data) {
  return data.reduce((acc, item) => {
      // Exclude unwanted fields
      if (item.category && item.value && item.number === undefined && item.section === undefined) {
          acc[item.category] = item.value;
      }
      return acc;
  }, {});
}
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
  console.log('Received data for collection:', collectionName, req.body);

  try {
    const collection = mongoose.connection.db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    console.log('Insert result:', result); 
    res.status(201).json(result);
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).send('Error saving document');
  }
});
//milestone endpoint
app.get('/api/milestone/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;

  try {
      const collection = await mongoose.connection.db.collection(collectionName);
      const documents = await collection.find({}).toArray();

      const totalDocuments = documents.length;
      const satisfactoryDocuments = documents.filter(doc => doc.status === 'satisfactory').length;

      const satisfactionPercentage = (satisfactoryDocuments / totalDocuments) * 100;

      const milestone = {
          totalDocuments,
          satisfactoryDocuments,
          needsRevisionDocuments: totalDocuments - satisfactoryDocuments,
          satisfactionPercentage: satisfactionPercentage.toFixed(2) // Round to 2 decimal places
      };

      res.json(milestone);
  } catch (error) {
      console.error('Error generating milestone:', error);
      res.status(500).json({ error: 'Error generating milestone' });
  }
});
//feedback endpoint
app.post('/api/submitFeedback', async (req, res) => {
  try {
      const { documentId, feedbackText, submittedBy } = req.body;

      const feedback = new Feedback({
          documentId,
          feedbackText,
          submittedBy
      });

      await feedback.save();
      res.status(201).json({ message: 'Feedback successfully submitted' });
  } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ error: 'Error submitting feedback' });
  }
});



// Serve static files
app.use(express.static(__dirname));




app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newCollection', (collectionName) => {
    console.log('New collection added:', collectionName);
    io.emit('updateCollections');
  });
});

const PORT = 5500;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
