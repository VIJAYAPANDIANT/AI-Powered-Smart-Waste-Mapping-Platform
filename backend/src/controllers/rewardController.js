const Reward = require('../models/Reward');
const User = require('../models/User');

// @desc    Get all active marketplace rewards
// @route   GET /api/rewards
// @access  Public
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ stock: { $gt: 0 } });
    res.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Redeem a marketplace reward
// @route   POST /api/rewards/redeem
// @access  Private
const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;

    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Reward out of stock' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.impactScore < reward.pointsCost) {
      return res.status(400).json({ success: false, message: 'Insufficient impact score points' });
    }

    // Deduct points and decrease stock
    user.impactScore -= reward.pointsCost;
    await user.save();

    reward.stock -= 1;
    await reward.save();

    res.json({
      success: true,
      message: `Successfully redeemed! Use code: ${reward.code}`,
      code: reward.code,
      newScore: user.impactScore,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRewards,
  redeemReward,
};
