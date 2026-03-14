
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Bin = require('../models/Bin');
const Report = require('../models/Report');
const Route = require('../models/Route');
const router = express.Router();

// Admin only middleware
const adminAuth = auth(['City Admin']);

// GET /api/admin/bins - all bins
router.get('/bins', adminAuth, async (req, res) => {
  try {
    const bins = await Bin.find().sort({ fillLevel: -1 });
    res.json(bins);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/admin/users - all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/users - create user
router.post('/users', adminAuth, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // hash password logic here (copy from auth.js)
    const newUser = new User({ email, password: 'hashed', role });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/admin/users/:id - update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { role, banned, assignedVehicle } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, banned, assignedVehicle },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Reports Management
// GET /api/admin/reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const { status, assigned } = req.query;
    let query = {};
    if (status) query.status = status;
    const reports = await Report.find(query)
      .populate('userId', 'email')
      .populate('assignedDriver', 'email')
      .populate('binId', 'location neighborhood fillLevel')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/reports - admin create report (rare)
router.post('/reports', adminAuth, async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUT /api/admin/reports/:id/assign - assign driver
router.put('/reports/:id/assign', adminAuth, async (req, res) => {
  try {
    const { driverId } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'assigned', assignedDriver: driverId },
      { new: true }
    ).populate('assignedDriver', 'email');
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/admin/reports/:id/resolve
router.put('/reports/:id/resolve', adminAuth, async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved', resolvedAt: new Date() },
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/admin/reports/:id
router.delete('/reports/:id', adminAuth, async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route Management
// GET /api/admin/routes
router.get('/routes', adminAuth, async (req, res) => {
  try {
    const routes = await Route.find()
      .populate('driverId', 'email assignedVehicle')
      .populate('bins');
    res.json(routes);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/admin/routes/generate - generate optimized route (stub)
router.post('/routes/generate', adminAuth, async (req, res) => {
  try {
    const { driverId, priorityBins } = req.body;
    // Stub optimization - simple sort by fillLevel
    const route = new Route({
      driverId,
      bins: priorityBins.slice(0, 10), // top 10
      status: 'pending',
      distance: Math.random() * 50 + 10,
      eta: Math.random() * 120 + 60,
      priorityScore: 95
    });
    await route.save();
    res.json(route);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Analytics Dashboard
// GET /api/admin/analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const totalBins = await Bin.countDocuments();
    const fullBins = await Bin.countDocuments({ fillLevel: { $gt: 80 } });
    const activeRoutes = await Route.countDocuments({ status: 'active' });
    const openReports = await Report.countDocuments({ status: { $ne: 'resolved' } });
    
    // Mock trends data
    const trends = [
      { name: 'Mon', waste: 1250, collections: 45 },
      { name: 'Tue', waste: 1340, collections: 52 },
      { name: 'Wed', waste: 1420, collections: 48 },
      { name: 'Thu', waste: 1280, collections: 50 },
      { name: 'Fri', waste: 1560, collections: 55 }
    ];

    res.json({
      metrics: {
        totalBins,
        fullBins,
        activeRoutes,
        openReports,
        collectionEfficiency: 94.2
      },
      trends,
      driverPerformance: [
        { driver: 'John D.', efficiency: 98.5, bins: 45 },
        { driver: 'Sarah K.', efficiency: 96.8, bins: 52 },
        { driver: 'Mike R.', efficiency: 95.2, bins: 48 }
      ]
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Weather Priority System
// GET /api/admin/weather
router.get('/weather', adminAuth, async (req, res) => {
  // Mock weather data
  const temp = 32; // >30°C
  const humidity = 65;
  const priorityAdjustments = temp > 30 ? { organicPriorityBoost: 50 } : {};
  
  res.json({
    current: { temp, humidity, condition: 'Hot' },
    alerts: temp > 30 ? ['High temperature - Organic bins priority +50%', 'Methane risk elevated'] : [],
    priorityAdjustments,
    methaneRisk: temp > 30 ? 'High' : 'Normal'
  });
});

module.exports = router;

