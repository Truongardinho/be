const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ID của đối tượng được thích (Event hoặc Comment)
    likeableId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    // Loại đối tượng được thích
    likeableType: {
      type: String,
      required: true,
      enum: ['Event', 'Comment'],
    },
  },
  { timestamps: true }
);

// Đảm bảo một user chỉ có thể like một đối tượng một lần
LikeSchema.index({ user: 1, likeableId: 1, likeableType: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);