const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reporter: { // Người báo cáo
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ID của đối tượng bị báo cáo
    reportedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Loại đối tượng bị báo cáo
    reportedType: {
      type: String,
      required: true,
      enum: ['Event', 'Comment', 'User'],
    },
    reason: { type: String, required: true }, // Lý do báo cáo
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);