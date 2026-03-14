const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Eco-Citizen', 'Truck Driver', 'City Admin'], default: 'Eco-Citizen' },
  greenPoints: { type: Number, default: 0 },
  banned: { type: Boolean, default: false },
  assignedVehicle: { type: String }
});

module.exports = mongoose.model('User', userSchema);

