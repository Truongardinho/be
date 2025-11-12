const express = require('express');
const router = express.Router();

// @route   POST api/registrations
// @desc    Register for an event
// @access  Public
router.post('/', (req, res) => {
    res.send('Register for an event');
});

module.exports = router;
