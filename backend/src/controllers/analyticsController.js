const WasteReport = require('../models/WasteReport');

// @desc    Get dashboard analytics & statistics
// @route   GET /api/analytics
// @access  Public (or Private)
const getAnalytics = async (req, res) => {
  try {
    const totalReports = await WasteReport.countDocuments();
    const pendingReports = await WasteReport.countDocuments({ status: 'pending' });
    const approvedReports = await WasteReport.countDocuments({ status: 'approved' });
    const resolvedReports = await WasteReport.countDocuments({ status: 'resolved' });
    const rejectedReports = await WasteReport.countDocuments({ status: 'rejected' });

    // Monthly trends (group by month of the current year)
    const currentYear = new Date().getFullYear();
    const monthlyTrends = await WasteReport.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    // Format monthly trends to array of months [Jan, Feb, ...]
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedTrends = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      count: 0,
    }));

    monthlyTrends.forEach((trend) => {
      const index = trend._id - 1;
      if (index >= 0 && index < 12) {
        formattedTrends[index].count = trend.count;
      }
    });

    // Waste Hotspots (group by rounded latitude & longitude or coordinates for heatmap mapping)
    const hotspots = await WasteReport.aggregate([
      {
        $group: {
          _id: {
            latitude: { $round: [{ $arrayElemAt: ['$location.coordinates', 1] }, 4] },
            longitude: { $round: [{ $arrayElemAt: ['$location.coordinates', 0] }, 4] },
            address: '$location.address',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          latitude: '$_id.latitude',
          longitude: '$_id.longitude',
          address: '$_id.address',
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          total: totalReports,
          pending: pendingReports,
          approved: approvedReports,
          resolved: resolvedReports,
          rejected: rejectedReports,
        },
        monthlyTrends: formattedTrends,
        hotspots,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportReportsCSV = async (req, res) => {
  try {
    const reports = await WasteReport.find().populate('userId', 'username');
    let csv = 'ReportID,WasteType,Status,Address,Latitude,Longitude,Reporter,CreatedAt\n';
    
    reports.forEach((r) => {
      const coords = r.location?.coordinates || [0, 0];
      const address = r.location?.address ? r.location.address.replace(/"/g, '""') : '';
      csv += `"${r._id}","${r.wasteType}","${r.status}","${address}",${coords[1]},${coords[0]},"${r.userId?.username || 'Guest'}","${r.createdAt.toISOString()}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('waste_reports_analytics.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  exportReportsCSV,
};
