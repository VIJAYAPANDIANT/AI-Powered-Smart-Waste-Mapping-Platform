const express = require('express');
const router = express.Router();
const { getAnalytics, exportReportsCSV } = require('../controllers/analyticsController');

router.get('/', getAnalytics);
router.get('/csv', exportReportsCSV);

module.exports = router;
