const express = require('express');
const router = express.Router();
const { createReport, getReports, getMyReports } = require('../controllers/wasteController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/report', protect, upload.single('photo'), createReport);
router.get('/', getReports);
router.get('/my-reports', protect, getMyReports);

module.exports = router;
