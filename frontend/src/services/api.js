import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Helper function to generate 10 realistic demo reports
const generateDemoReports = () => {
  return [
    { _id: 'd1', wasteType: 'Plastic', status: 'pending', location: { coordinates: [-122.4194, 37.7749], address: 'Civic Center, SF' }, createdAt: new Date(Date.now() - 100000000).toISOString() },
    { _id: 'd2', wasteType: 'E-waste', status: 'approved', location: { coordinates: [-122.4250, 37.7800], address: 'Tenderloin, SF' }, createdAt: new Date(Date.now() - 200000000).toISOString() },
    { _id: 'd3', wasteType: 'Organic', status: 'resolved', location: { coordinates: [-122.4000, 37.7900], address: 'Financial District, SF' }, createdAt: new Date(Date.now() - 300000000).toISOString() },
    { _id: 'd4', wasteType: 'Metal', status: 'pending', location: { coordinates: [-122.4100, 37.7600], address: 'Mission District, SF' }, createdAt: new Date(Date.now() - 400000000).toISOString() },
    { _id: 'd5', wasteType: 'Glass', status: 'resolved', location: { coordinates: [-122.4300, 37.7500], address: 'Castro, SF' }, createdAt: new Date(Date.now() - 500000000).toISOString() },
    { _id: 'd6', wasteType: 'Plastic', status: 'approved', location: { coordinates: [77.2090, 28.6139], address: 'New Delhi, India' }, createdAt: new Date(Date.now() - 600000000).toISOString() },
    { _id: 'd7', wasteType: 'Hazardous', status: 'pending', location: { coordinates: [-79.3832, 43.6532], address: 'Toronto, Canada' }, createdAt: new Date(Date.now() - 700000000).toISOString() },
    { _id: 'd8', wasteType: 'Other', status: 'resolved', location: { coordinates: [-0.1276, 51.5072], address: 'London, UK' }, createdAt: new Date(Date.now() - 800000000).toISOString() },
    { _id: 'd9', wasteType: 'Organic', status: 'approved', location: { coordinates: [139.6917, 35.6895], address: 'Tokyo, Japan' }, createdAt: new Date(Date.now() - 900000000).toISOString() },
    { _id: 'd10', wasteType: 'Metal', status: 'pending', location: { coordinates: [12.4922, 41.8902], address: 'Rome, Italy' }, createdAt: new Date(Date.now() - 1000000000).toISOString() },
  ];
};

export const getWasteReports = async () => {
  try {
    const res = await api.get('/waste');
    if (!res.data.data || res.data.data.length === 0) {
      return { success: true, data: generateDemoReports() };
    }
    return res.data;
  } catch (err) {
    return { success: true, data: generateDemoReports() };
  }
};

export const getMyWasteReports = async () => {
  try {
    const res = await api.get('/waste/my-reports');
    return res.data;
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const createWasteReport = async (formData) => {
  const res = await api.post('/waste/report', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getAnalyticsData = async () => {
  try {
    const res = await api.get('/analytics');
    if (!res.data.data.stats || res.data.data.stats.total === 0) {
      return {
        success: true,
        data: {
          stats: { total: 10, pending: 4, approved: 3, resolved: 3, rejected: 0 },
          monthlyTrends: [
            { month: 'Jan', count: 2 }, { month: 'Feb', count: 4 }, { month: 'Mar', count: 1 },
            { month: 'Apr', count: 0 }, { month: 'May', count: 3 }, { month: 'Jun', count: 0 },
            { month: 'Jul', count: 0 }, { month: 'Aug', count: 0 }, { month: 'Sep', count: 0 },
            { month: 'Oct', count: 0 }, { month: 'Nov', count: 0 }, { month: 'Dec', count: 0 }
          ],
          hotspots: [
            { latitude: 37.7749, longitude: -122.4194, address: 'Civic Center, SF', count: 4 },
            { latitude: 28.6139, longitude: 77.2090, address: 'New Delhi, India', count: 2 },
            { latitude: 51.5072, longitude: -0.1276, address: 'London, UK', count: 2 },
            { latitude: 43.6532, longitude: -79.3832, address: 'Toronto, Canada', count: 1 },
            { latitude: 35.6895, longitude: 139.6917, address: 'Tokyo, Japan', count: 1 }
          ]
        }
      };
    }
    return res.data;
  } catch (err) {
    return { success: false };
  }
};

export const getLeaderboardData = async () => {
  const res = await api.get('/analytics'); 
  return res.data;
};

export const adminUpdateReportStatus = async (id, status) => {
  const res = await api.put(`/admin/waste/${id}/status`, { status });
  return res.data;
};

export const adminAssignTeam = async (id, assignedTeam) => {
  const res = await api.put(`/admin/waste/${id}/assign`, { assignedTeam });
  return res.data;
};

export default api;
