const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const { sendRealtimeNotification } = require('../socket/socketHandler');

// @desc    Update report status (approve, reject, resolve)
// @route   PUT /api/admin/waste/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const report = await WasteReport.findById(req.id || req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    // Notify user
    const notification = await Notification.create({
      userId: report.userId,
      message: `Your waste report at ${report.location.address} has been ${status}.`,
      type: 'report_status',
    });
    sendRealtimeNotification(report.userId, notification);

    // If resolved, award user additional impact points (+50)
    if (status === 'resolved') {
      const user = await User.findById(report.userId);
      if (user) {
        user.impactScore += 50;
        await user.save();

        // Check if user earned 100 impact points
        if (user.impactScore >= 100) {
          const achievementExists = await Achievement.findOne({ userId: user._id, title: 'Eco Champion' });
          if (!achievementExists) {
            const ach = await Achievement.create({
              userId: user._id,
              title: 'Eco Champion',
              description: 'Earned 100+ impact points by resolving waste piles!',
              badgeUrl: 'https://res.cloudinary.com/demo/image/upload/v1580974719/eco-champion.png',
            });
            sendRealtimeNotification(user._id, {
              type: 'achievement',
              message: `Achievement Unlocked: ${ach.title}!`,
            });
          }
        }
      }
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign cleanup team to a report
// @route   PUT /api/admin/waste/:id/assign
// @access  Private/Admin
const assignTeam = async (req, res) => {
  try {
    const { assignedTeam } = req.body;

    const report = await WasteReport.findById(req.id || req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.assignedTeam = assignedTeam;
    report.status = 'approved'; // Assigning team implies report is approved/active
    await report.save();

    // Notify user
    const notification = await Notification.create({
      userId: report.userId,
      message: `Cleanup team "${assignedTeam}" has been assigned to clean up your reported waste.`,
      type: 'report_status',
    });
    sendRealtimeNotification(report.userId, notification);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateReportStatus,
  assignTeam,
};
