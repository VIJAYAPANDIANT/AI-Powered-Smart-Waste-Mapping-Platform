const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { sendRealtimeNotification } = require('../socket/socketHandler');

// @desc    Report new waste
// @route   POST /api/waste/report
// @access  Private
const createReport = async (req, res) => {
  try {
    const { address, latitude, longitude, wasteType, description } = req.body;

    const photoUrl = req.file ? req.file.path : '';

    const wasteReport = await WasteReport.create({
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
      },
      wasteType,
      description,
      photoUrl,
      userId: req.user._id,
    });

    // Create Notification
    const notification = await Notification.create({
      userId: req.user._id,
      message: `Your waste report for ${wasteType} has been successfully submitted!`,
      type: 'report_status',
    });

    // Send real-time notification
    sendRealtimeNotification(req.user._id, notification);

    // Update user impact score (+10 for reporting)
    const user = await User.findById(req.user._id);
    if (user) {
      user.impactScore += 10;
      await user.save();

      // Check for first report achievement
      const reportCount = await WasteReport.countDocuments({ userId: req.user._id });
      if (reportCount === 1) {
        const achievement = await Achievement.create({
          userId: req.user._id,
          title: 'Eco Beginner',
          description: 'Reported your first waste pile to help clean the planet!',
          badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-beginner.png',
        });
        sendRealtimeNotification(req.user._id, {
          type: 'achievement',
          message: `Achievement Unlocked: ${achievement.title}!`,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: wasteReport,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/waste
// @access  Public
const getReports = async (req, res) => {
  try {
    const reports = await WasteReport.find().populate('userId', 'username email');
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reports reported by logged-in user
// @route   GET /api/waste/my-reports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ userId: req.user._id });
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getMyReports,
};
