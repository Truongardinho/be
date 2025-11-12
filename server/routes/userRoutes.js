const router = require('express').Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const bcrypt = require('bcrypt');

// Middleware cho tất cả các route trong file này: yêu cầu đăng nhập và là admin
router.use(authMiddleware, adminMiddleware);

// Lấy tất cả người dùng
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Không trả về mật khẩu
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lấy một người dùng theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cập nhật người dùng
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const updateData = { username, email, role };

    // Nếu có cập nhật mật khẩu thì hash mật khẩu mới
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa người dùng
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User has been deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;