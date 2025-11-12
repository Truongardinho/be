const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: { type: String, required: true, unique: true }, // VD: cong-nghe
});

module.exports = mongoose.model('Category', CategorySchema);