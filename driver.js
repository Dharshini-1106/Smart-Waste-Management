const express = require('express');
const Bin = require('../models/Bin');
const Route = require('../models/Route');
const router = express.Router();

// Get driver bins (prioritized by fill level, reports, etc.)
router.get('/bins', async (req, res) => {
  try {
    const { sort = 'fill' } = req.query;
    let sortOptions = { fillLevel: -1 }; // Default: highest fill first
    
    if (sort === 'priority') {
      sortOptions = { priority: -1 };
    } else if (sort === 'reports') {
      sortOptions = { reports: -1 };
    } else if (sort === 'route') {
      sortOptions = { optimizedRouteIndex: 1 };
    }
    
    const bins = await Bin.find({ fillLevel: { $gt: 0 } })
      .sort(sortOptions)
      .limit(50);
    
    // Add dummy priority and route info if not present
    const enrichedBins = bins.map(bin => ({
      ...bin._doc,
      priority: bin.fillLevel > 90 ? 'High' : bin.fillLevel > 70 ? 'Medium' : 'Low',
      reports: Math.floor(Math.random() * 5),
      neighborhood: bin.neighborhood || 'Downtown',
      optimizedRouteIndex: Math.floor(Math.random() * 20)
    }));
    
    res.json(enrichedBins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get driver tasks
router.get('/tasks', async (req, res) => {
  res.json({ tasks: [
    { id: 1, type: 'Collection', bins: 12, priority: 'High', eta: '2h 15m' },
    { id: 2, type: 'Maintenance', bins: 3, priority: 'Low', eta: '30m' }
  ]});
});

// Get driver profile
router.get('/profile', async (req, res) => {
  res.json({
    driverId: 'DRV-001',
    name: 'John Ramirez',
    vehicle: 'Truck T-456',
    license: 'DL-789012',
    totalRoutes: 247,
    totalCollections: 2847,
    efficiency: 97.8
  });
});

// Get optimized route with Mapbox Directions
router.get('/route', async (req, res) => {
  try {
    const { driverId, binIds } = req.query;
    
    // Fetch high priority bins (mock for now)
    const bins = await Bin.find({ fillLevel: { $gt: 70 } }).limit(5);
    const coordinates = bins.map(bin => bin.location.coordinates.reverse().join(',')).join(';'); // [lat,lng] format for Mapbox
    
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3JlZ29ye2Z1bGxlciIsImEiOiJjbG...'; // Use public hackathon token
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?alternatives=false&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // Save to Route model
      const newRoute = new Route({
        driverId,
        bins: bins.map(b => b._id),
        optimizedPath: route.geometry.coordinates.map(([lng, lat]) => ({ type: 'Point', coordinates: [lng, lat] })),
        distance: route.distance / 1000, // meters to km
        eta: Math.round(route.duration / 60), // seconds to minutes
        status: 'pending'
      });
      await newRoute.save();
      
      res.json({
        routeId: newRoute._id,
        geometry: route.geometry,
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        eta: `${Math.round(route.duration / 60)} min`,
        legs: route.legs.map(leg => ({
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps.slice(0, 3) // First 3 maneuvers
        })),
        bins: bins.slice(0, 3) // Next 3 bins
      });
    } else {
      res.status(404).json({ msg: 'No route found' });
    }
  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ msg: 'Route calculation failed' });
  }
});

// Track driver location (live GPS)
router.post('/track', async (req, res) => {
  try {
    const { driverId, routeId, latitude, longitude } = req.body;
    
    // Update route current location
    await Route.findOneAndUpdate(
      { _id: routeId, driverId },
      { 
        $set: { 
          currentLocation: { type: 'Point', coordinates: [longitude, latitude] },
          startedAt: new Date()
        },
        $currentDate: { updatedAt: true }
      }
    );
    
    res.json({ msg: 'Location updated', timestamp: new Date() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Track update failed' });
  }
});

// Get driver history
router.get('/history', async (req, res) => {
  res.json([
    { date: 'Today', bins: 12, distance: '18.4km', time: '2h 45m', efficiency: 98.2 },
    { date: 'Yesterday', bins: 15, distance: '22.1km', time: '3h 12m', efficiency: 96.8 }
  ]);
});

module.exports = router;

