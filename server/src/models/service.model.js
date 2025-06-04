const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    requiredDocuments: [{
      type: String,
      required: true,
    }],
    processingTime: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 