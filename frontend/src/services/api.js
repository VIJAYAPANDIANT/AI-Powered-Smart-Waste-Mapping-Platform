import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getWasteReports = async () => {
  const res = await api.get('/waste');
  return res.data;
};

export const getMyWasteReports = async () => {
  const res = await api.get('/waste/my-reports');
  return res.data;
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
  const res = await api.get('/analytics');
  return res.data;
};

export const getLeaderboardData = async () => {
  const res = await api.get('/analytics'); // We can extract hotspots or map users directly
  // For this, we'll fetch leaderboard data. Let's assume we can fetch user profile or scoreboard counts.
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
