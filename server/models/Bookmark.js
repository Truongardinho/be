const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  { timestamps: true }
);

// Đảm bảo một user chỉ bookmark một event một lần
BookmarkSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);