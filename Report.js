const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  issueType: { type: String, enum: ['overflow', 'broken', 'unclean', 'other'], required: true },
  status: { type: String, enum: ['pending', 'assigned', 'in-progress', 'resolved'], default: 'pending' },
  photos: [{ type: String }], // URLs
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }
  },
  resolvedAt: Date
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
