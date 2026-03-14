const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bin' }],
  status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
  optimizedPath: [{ 
    type: { type: String, enum: ['Point'] }, 
    coordinates: { type: [Number] } 
  }],
  distance: { type: Number }, // km
  eta: { type: Number }, // minutes
  assignedAt: { type: Date },
  startedAt: Date,
  completedAt: Date,
  priorityScore: { type: Number },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' }
  }
}, { timestamps: true });

routeSchema.index({ driverId: 1, status: 1 });
routeSchema.index({ 'bins': 1 });

module.exports = mongoose.model('Route', routeSchema);
