const express = require('express');
const { body } = require('express-validator');
const Service = require('../models/service.model');
const { auth, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');

const router = express.Router();

// Get all services (public)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const services = await Service.find(query)
      .populate('createdBy', 'name')
      .sort('-createdAt');

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

// Get service categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

// Get service by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('createdBy', 'name');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(500).json({ message: 'Error fetching service', error });
  }
});

// Create service (admin only)
router.post(
  '/',
  auth,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('requiredDocuments')
      .isArray()
      .withMessage('Required documents must be an array'),
    body('processingTime').notEmpty().withMessage('Processing time is required'),
    body('fees').isNumeric().withMessage('Fees must be a number'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const service = new Service({
        ...req.body,
        createdBy: req.user._id,
      });

      await service.save();
      res.status(201).json({
        message: 'Service created successfully',
        service,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating service', error });
    }
  }
);

// Update service (admin only)
router.put(
  '/:id',
  auth,
  authorize('admin'),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('requiredDocuments').optional().isArray(),
    body('processingTime').optional().notEmpty(),
    body('fees').optional().isNumeric(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }

      res.json({
        message: 'Service updated successfully',
        service,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating service', error });
    }
  }
);

// Delete service (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
});

module.exports = router; 