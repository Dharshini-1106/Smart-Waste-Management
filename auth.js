const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'Eco-Citizen' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email and password required' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword, role });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { email: user.email, role: user.role } });
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message, err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: 'Server config error: JWT_SECRET missing from .env' });
    }
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { email: user.email, role: user.role, greenPoints: user.greenPoints } });
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message, err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

module.exports = router;

