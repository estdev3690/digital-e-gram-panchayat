const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/application.model');
const { auth, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');

const router = express.Router();

// Ensure upload directories exist
const uploadDir = 'uploads';
const documentsDir = path.join(uploadDir, 'documents');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, documentsDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add timestamp
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png and .pdf files are allowed'));
  },
});

// Submit new application
router.post(
  '/',
  auth,
  (req, res, next) => {
    upload.array('documents')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'File upload error',
          error: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          message: 'Invalid file type',
          error: err.message,
        });
      }
      next();
    });
  },
  [body('service').notEmpty().withMessage('Service ID is required')],
  validateRequest,
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: 'Required documents are missing',
        });
      }

      const documents = req.files.map(file => ({
        name: file.originalname,
        path: file.path,
        uploadedAt: new Date(),
      }));

      // Generate application number
      const applicationCount = await Application.countDocuments();
      const applicationNumber = `APP${new Date().getFullYear()}${String(applicationCount + 1).padStart(4, '0')}`;

      const application = new Application({
        applicationNumber,
        service: req.body.service,
        applicant: req.user._id,
        documents,
        status: 'pending',
        remarks: [{
          status: 'pending',
          comment: 'Application submitted successfully',
          updatedBy: req.user._id,
        }],
      });

      await application.save();

      res.status(201).json({
        message: 'Application submitted successfully',
        application,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      res.status(500).json({
        message: 'Error submitting application',
        error: error.message,
      });
    }
  }
);

// Get user's applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('service')
      .sort('-createdAt');

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});

// Get all applications (staff and admin only)
router.get(
  '/',
  auth,
  authorize('staff', 'admin'),
  async (req, res) => {
    try {
      const { status, search } = req.query;
      let query = {};

      if (status) {
        query.status = status;
      }

      if (search) {
        query.applicationNumber = new RegExp(search, 'i');
      }

      const applications = await Application.find(query)
        .populate('service')
        .populate('applicant', 'name email phone')
        .sort('-createdAt');

      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications', error });
    }
  }
);

// Update application status (staff and admin only)
router.patch(
  '/:id/status',
  auth,
  authorize('staff', 'admin'),
  [
    body('status')
      .isIn(['pending', 'under-review', 'approved', 'rejected'])
      .withMessage('Invalid status'),
    body('comment').notEmpty().withMessage('Comment is required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { status, comment } = req.body;

      const application = await Application.findById(req.params.id);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      application.status = status;
      application.remarks.push({
        comment,
        status,
        updatedBy: req.user._id,
      });

      await application.save();

      res.json({
        message: 'Application status updated successfully',
        application,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating application status', error });
    }
  }
);

// Get application details
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('service')
      .populate('applicant', 'name email phone')
      .populate('remarks.updatedBy', 'name');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has permission to view this application
    if (
      req.user.role === 'user' &&
      application.applicant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application details', error });
  }
});

module.exports = router; 