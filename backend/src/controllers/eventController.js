const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create a community cleanup event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, address, latitude, longitude, date } = req.body;

    const event = await Event.create({
      title,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address
      },
      date,
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all community cleanup events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('volunteers', 'username email');
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a community cleanup event as volunteer
// @route   POST /api/events/:id/join
// @access  Private
const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.id || req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.volunteers.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already volunteered for this event' });
    }

    event.volunteers.push(req.user._id);
    await event.save();

    // Reward points for volunteering (+50 XP)
    const user = await User.findById(req.user._id);
    if (user) {
      user.impactScore += 50;
      user.dailyScore += 50;
      user.weeklyScore += 50;
      user.monthlyScore += 50;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Volunteered successfully! +50 Eco Points awarded.',
      data: event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  joinEvent,
};
