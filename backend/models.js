const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'procurement_manager' },
  company: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Supplier Schema
const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  category: { type: String, enum: ['manufacturer', 'distributor', 'service'] },
  address: String,
  status: { type: String, default: 'active' },
  performanceScore: { type: Number, default: 0 },
  riskLevel: { type: String, default: 'medium' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Procurement Schema
const procurementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  budget: Number,
  deadline: Date,
  status: { type: String, default: 'draft' },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Knowledge Base Schema
const knowledgeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['guide', 'process', 'policy'] },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Supplier = mongoose.model('Supplier', supplierSchema);
const Procurement = mongoose.model('Procurement', procurementSchema);
const Knowledge = mongoose.model('Knowledge', knowledgeSchema);

module.exports = { User, Supplier, Procurement, Knowledge };