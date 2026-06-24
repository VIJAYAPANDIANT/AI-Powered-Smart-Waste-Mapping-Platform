const express = require('express');
const router = express.Router();
const { createEvent, getEvents, joinEvent } = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getEvents);
router.post('/', protect, createEvent);
router.post('/:id/join', protect, joinEvent);

module.exports = router;
