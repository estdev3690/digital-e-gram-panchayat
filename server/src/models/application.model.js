const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'under-review', 'approved', 'rejected'],
      default: 'pending',
    },
    documents: [{
      name: String,
      path: String,
      uploadedAt: Date,
    }],
    remarks: [{
      comment: String,
      status: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    applicationNumber: {
      type: String,
      unique: true,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentDetails: {
      amount: Number,
      transactionId: String,
      paidAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique application number before saving
applicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Application').countDocuments() + 1;
    this.applicationNumber = `GP${year}${month}${count.toString().padStart(4, '0')}`;
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application; 