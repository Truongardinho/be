const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Cấu hình Multer để xử lý file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất để tránh trùng lặp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).array('imageFiles', 10); // Cho phép tải lên tối đa 10 ảnh

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'username');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload, async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      organizer: req.user.id // Gán người tổ chức là admin đang đăng nhập
    };

    if (req.files && req.files.length > 0) {
      // Nếu có file được tải lên, lưu mảng đường dẫn vào database
      eventData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newEvent = new Event(eventData);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Cập nhật các trường từ req.body một cách tường minh
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;

    let existingImages = event.images || [];

    // Xử lý xóa ảnh cũ
    if (req.body.removeImages) {
      const imagesToRemove = JSON.parse(req.body.removeImages);
      imagesToRemove.forEach(imageUrl => {
        try {
          const fullPath = path.join(__dirname, '..', imageUrl);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.error('Failed to delete an image to remove:', err);
        }
      });
      existingImages = existingImages.filter(img => !imagesToRemove.includes(img));
    }

    // Xử lý thêm ảnh mới
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      existingImages = existingImages.concat(newImages);
    }

    event.images = existingImages;

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Xóa tất cả ảnh liên quan đến sự kiện
    if (event.images && event.images.length > 0) {
      event.images.forEach(imageUrl => {
        const fullPath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event has been deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;