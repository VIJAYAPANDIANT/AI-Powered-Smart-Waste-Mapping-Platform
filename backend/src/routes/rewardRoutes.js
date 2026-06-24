const express = require('express');
const router = express.Router();
const { getRewards, redeemReward } = require('../controllers/rewardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', getRewards);
router.post('/redeem', protect, redeemReward);

module.exports = router;
