const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./auth');
const supplierRoutes = require('./suppliers');
const procurementRoutes = require('./procurements');
const knowledgeRoutes = require('./knowledge');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/srm_database')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/procurements', procurementRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'SRM System API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});