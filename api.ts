import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const WS_BASE = 'ws://localhost:5000/ws';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Driver endpoints
export const getDriverTasks = () => api.get('/driver/tasks');
export const getDriverBins = (sort = 'fill') => api.get(`/api/driver/bins?sort=${sort}`);
export const getDriverProfile = () => api.get('/driver/profile');
export const getDriverHistory = () => api.get('/driver/history');
export const getDriverRoute = () => api.get('/api/driver/route?driverId=DRV-001');
export const postTrackLocation = (data) => api.post('/api/driver/track', data);
export const collectBin = (id, data) => api.patch(`/bins/${id}/collect`, data);

// Existing citizen endpoints
export const getUserReports = () => api.get('/user/reports');
export const createReport = (data) => api.post('/reports', data);
export const getNotifications = () => api.get('/notifications');
export const getImpactStats = () => api.get('/impact');
export const getBinById = (id) => api.get(`/bins/${id}`);
export const updateUser = (data) => api.put('/user', data);

export { WS_BASE };
