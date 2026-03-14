const express = require('express');
const router = express.Router();

// Mock data for user reports
const mockReports = [
  {
    _id: '1',
    issueType: 'Broken Lid',
    status: 'Resolved',
    location: { coordinates: [40.7128, -74.0060] },
    photo: null,
    createdAt: '2024-10-10T14:30:00Z'
  },
  {
    _id: '2',
    issueType: 'Illegal Dumping',
    status: 'In Progress',
    location: { coordinates: [40.7138, -74.0070] },
    photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8A',
    createdAt: '2024-10-09T09:15:00Z'
  }
];

// Mock impact stats
const mockImpactStats = {
  co2Saved: 124.5,
  treesSaved: 5,
  wasteRecycled: 85.3,
  ranking: 23,
  totalReports: 12
};

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'bin_full',
    title: 'Bin near you is full',
    message: 'Organic bin at Main St is 92% full. Consider using another.',
    location: { coordinates: [40.7128, -74.0060] },
    time: '2 min ago',
    read: false
  },
  {
    id: '2',
    type: 'report_resolved',
    title: 'Your report was resolved',
    message: 'Broken lid on bin #ABC123 has been fixed. Thank you!',
    time: '1 hour ago',
    read: true
  },
  {
    id: '3',
    type: 'collection_scheduled',
    title: 'Collection scheduled today',
    message: 'Truck collection in your neighborhood between 2-4 PM.',
    time: 'Today, 10:32 AM',
    read: false
  }
];

// GET /user/reports
router.get('/reports', (req, res) => {
  res.json(mockReports);
});

// GET /impact
router.get('/impact', (req, res) => {
  res.json(mockImpactStats);
});

// GET /notifications
router.get('/notifications', (req, res) => {
  res.json(mockNotifications);
});

module.exports = router;

