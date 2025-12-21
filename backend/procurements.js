const express = require('express');
const jwt = require('jsonwebtoken');
const { Procurement } = require('./models');

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'srm-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all procurements
router.get('/', verifyToken, async (req, res) => {
  try {
    const procurements = await Procurement.find()
      .populate('supplier', 'name email')
      .populate('createdBy', 'name email');
    res.json(procurements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single procurement
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const procurement = await Procurement.findById(req.params.id)
      .populate('supplier', 'name email phone')
      .populate('createdBy', 'name email');
    if (!procurement) {
      return res.status(404).json({ error: 'Procurement not found' });
    }
    res.json(procurement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create procurement
router.post('/', verifyToken, async (req, res) => {
  try {
    const procurement = new Procurement({
      ...req.body,
      createdBy: req.userId
    });
    await procurement.save();
    res.status(201).json({ message: 'Procurement created successfully', procurement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update procurement
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!procurement) {
      return res.status(404).json({ error: 'Procurement not found' });
    }
    res.json({ message: 'Procurement updated successfully', procurement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete procurement
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const procurement = await Procurement.findByIdAndDelete(req.params.id);
    if (!procurement) {
      return res.status(404).json({ error: 'Procurement not found' });
    }
    res.json({ message: 'Procurement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;