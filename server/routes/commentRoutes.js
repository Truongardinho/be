const router = require('express').Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');

// Lấy tất cả bình luận cho một sự kiện
router.get('/:eventId', async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .populate('user', 'username') // Chỉ lấy username của người dùng
      .sort({ createdAt: -1 }); // Sắp xếp bình luận mới nhất lên đầu
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo một bình luận mới (yêu cầu đăng nhập)
router.post('/:eventId', authMiddleware, async (req, res) => {
  try {
    const newComment = new Comment({
      content: req.body.content,
      user: req.user.id,
      event: req.params.eventId,
    });

    const savedComment = await newComment.save();
    // Populate user info before sending back
    const populatedComment = await Comment.findById(savedComment._id).populate('user', 'username');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa một bình luận (chỉ admin hoặc chủ sở hữu bình luận)
router.delete('/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Kiểm tra quyền: user là admin hoặc là người đã viết bình luận
    if (req.user.role !== 'admin' && comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({ message: 'Comment has been deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;