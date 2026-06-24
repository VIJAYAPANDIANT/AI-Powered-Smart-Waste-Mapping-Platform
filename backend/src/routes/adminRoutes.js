const express = require('express');
const router = express.Router();
const { updateReportStatus, assignTeam } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.put('/waste/:id/status', protect, admin, updateReportStatus);
router.put('/waste/:id/assign', protect, admin, assignTeam);

module.exports = router;
