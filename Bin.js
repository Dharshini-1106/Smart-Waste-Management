const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  fillLevel: { type: Number, default: 0 },
  predictedFull: { type: Date },
  neighborhood: { type: String, default: 'Downtown' } // For admin analytics
});

binSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Bin', binSchema);
