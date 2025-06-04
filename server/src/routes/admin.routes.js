const express = require('express');
const Application = require('../models/application.model');
const User = require('../models/user.model');
const Service = require('../models/service.model');
const { auth, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Get admin dashboard statistics
router.get('/stats', auth, authorize('admin'), async (req, res) => {
  try {
    // Get total counts
    const [
      totalApplications,
      totalUsers,
      activeServices,
      approvedApplications,
      recentApplications,
      popularServices,
    ] = await Promise.all([
      Application.countDocuments(),
      User.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Application.countDocuments({ status: 'approved' }),
      Application.find()
        .sort('-createdAt')
        .limit(5)
        .populate('service', 'title'),
      Application.aggregate([
        {
          $group: {
            _id: '$service',
            applicationCount: { $sum: 1 },
          },
        },
        {
          $sort: { applicationCount: -1 },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: 'services',
            localField: '_id',
            foreignField: '_id',
            as: 'service',
          },
        },
        {
          $unwind: '$service',
        },
        {
          $project: {
            _id: '$service._id',
            title: '$service.title',
            applicationCount: 1,
          },
        },
      ]),
    ]);

    res.json({
      totalApplications,
      totalUsers,
      activeServices,
      approvedApplications,
      recentApplications,
      popularServices,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
});

module.exports = router; 