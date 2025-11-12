const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: { type: String, required: true, unique: true }, // VD: javascript
});

module.exports = mongoose.model('Tag', TagSchema);