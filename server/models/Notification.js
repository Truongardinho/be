const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: { // Người nhận
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: { // Người gửi (hệ thống hoặc user khác)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: { // Loại thông báo
      type: String,
      enum: ['new_comment', 'event_reminder', 'new_follower', 'report_update'],
      required: true,
    },
    content: String, // Nội dung thông báo
    link: String, // Đường dẫn đến event, comment...
    read: { type: Boolean, default: false }, // Trạng thái đã đọc
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);