const express = require('express');
const { body } = require('express-validator');
const User = require('../models/user.model');
const { auth, authorize } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validate.middleware');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
});

// Update user profile
router.put(
  '/profile',
  auth,
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().notEmpty(),
    body('address').optional().isObject(),
    body('address.street').optional().notEmpty(),
    body('address.city').optional().notEmpty(),
    body('address.state').optional().notEmpty(),
    body('address.pincode').optional().notEmpty(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const allowedUpdates = ['name', 'phone', 'address'];
      const updates = {};

      Object.keys(req.body).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
      ).select('-password');

      res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  }
);

// Change password
router.put(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);
      const isMatch = await user.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error });
    }
  }
);

// Get all users (admin only)
router.get(
  '/',
  auth,
  authorize('admin'),
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort('-createdAt');

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }
);

// Update user role (admin only)
router.patch(
  '/:id/role',
  auth,
  authorize('admin'),
  [
    body('role')
      .isIn(['user', 'staff', 'admin'])
      .withMessage('Invalid role'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role: req.body.role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'User role updated successfully',
        user,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user role', error });
    }
  }
);

module.exports = router; 