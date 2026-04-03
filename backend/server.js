const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables
dotenv.config();

const app = express();

// 2. Updated CORS to be more flexible for Vercel
app.use(cors({
  origin: "*", // Allows your frontend to talk to this backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Import routes
const authRoutes = require('./auth');
const supplierRoutes = require('./suppliers');
const procurementRoutes = require('./procurements');
const knowledgeRoutes = require('./knowledge');

// 3. FIX: Use process.env.MONGO_URI for the cloud database
// It will use Atlas on Vercel and your local DB on your laptop
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/srm_database';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/procurements', procurementRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Root endpoint (Test this in your browser)
app.get('/', (req, res) => {
  res.json({ message: 'SRM System API is running!' });
});

// 4. FIX: Vercel assigns a random PORT, so process.env.PORT is required
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
