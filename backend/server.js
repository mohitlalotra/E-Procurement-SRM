const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

const app = express();

// 2. Flexible CORS for Deployment
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Import routes
const authRoutes = require('./auth');
const supplierRoutes = require('./suppliers');
const procurementRoutes = require('./procurements');
const knowledgeRoutes = require('./knowledge');

// 3. Connect to MongoDB
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srm_database';

mongoose.connect(dbURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/procurements', procurementRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SRM System API is running!' });
});

// 4. Set the Port (Required for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});