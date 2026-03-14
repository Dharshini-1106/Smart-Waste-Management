const express = require('express');
const Bin = require('../models/Bin');

const router = express.Router();

// Get all bins
router.get('/', async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Calculate predicted full time based on linear regression (heuristic example)
function calculatePrediction(fillLevel) {
  const hoursLeft = ((100 - fillLevel) / 5); // 5% fill per hour approx
  const predicted = new Date();
  predicted.setHours(predicted.getHours() + hoursLeft);
  return predicted;
}

// Simulates updating bin levels every so often and updating prediction
router.post('/simulate', async (req, res) => {
    try {
        const bins = await Bin.find();
        for (let bin of bins) {
            // Randomly increase fill level by 0 to 10
            bin.fillLevel = Math.min(100, bin.fillLevel + Math.floor(Math.random() * 10));
            if (bin.fillLevel === 100) {
               // Empty if randomly handled? Maybe just leave full, or driver empties it.
               if(Math.random() > 0.8) bin.fillLevel = 0; // 20% chance getting emptied by someone randomly
            }
            bin.predictedFull = calculatePrediction(bin.fillLevel);
            await bin.save();
        }
        res.json({ msg: 'Simulation updated' });
    } catch(err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Admin analytics endpoint
router.get('/analytics', async (req, res) => {
    try {
        const bins = await Bin.find();
        const neighborhoodVolumes = {};
        
        bins.forEach(bin => {
            const nh = bin.neighborhood || 'Unknown';
            neighborhoodVolumes[nh] = (neighborhoodVolumes[nh] || 0) + bin.fillLevel;
        });

        const data = Object.keys(neighborhoodVolumes).map(k => ({
            name: k,
            volume: neighborhoodVolumes[k]
        }));
        
        res.json(data);
    } catch(err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
