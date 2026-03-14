require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const Bin = require('./models/Bin');

// JWT_SECRET fallback (REQUIRED for register)
process.env.JWT_SECRET = process.env.JWT_SECRET || 'ecoBinHackathonJWTsecret987654321fedcba0987654321zyxwvutsrqponmlkjihgfedcba987654321';
console.log('JWT_SECRET set:', process.env.JWT_SECRET ? 'YES' : 'NO');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// JWT_SECRET fallback for demo (REMOVE for production)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallbackJWTsecretDEMOkey987654321abcdefghijklmnop0123456789ABCDEF';
  console.warn('⚠️ Using FALLBACK JWT_SECRET - ADD to .env for production!');
}

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bins', require('./routes/bins'));
app.use('/api/driver', require('./routes/driver'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));

// Mock Data Seeder function
const seedData = async () => {
    try {
        const count = await Bin.countDocuments();
        if(count === 0) {
            console.log('Seeding initial bins...');
            const seedLocations = [
                { location: { type: 'Point', coordinates: [-74.006, 40.7128] }, fillLevel: 45, neighborhood: 'Downtown' },
                { location: { type: 'Point', coordinates: [-74.010, 40.7130] }, fillLevel: 90, neighborhood: 'Downtown' },
                { location: { type: 'Point', coordinates: [-74.008, 40.7150] }, fillLevel: 10, neighborhood: 'Midtown' },
                { location: { type: 'Point', coordinates: [-74.003, 40.7120] }, fillLevel: 85, neighborhood: 'Uptown' },
                { location: { type: 'Point', coordinates: [-74.009, 40.7115] }, fillLevel: 100, neighborhood: 'Downtown' },
            ];
            try {
                await Bin.insertMany(seedLocations);
                console.log('✅ Seed data inserted successfully');
            } catch (seedErr) {
                console.error('❌ Seed insert failed:', seedErr.message);
            }
        }
    } catch(err) {
        console.error('SeedData outer error:', err.message);
    }
}

seedData();

// Internal Simulator that changes bin levels every 10 seconds
setInterval(async () => {
    try {
        const bins = await Bin.find();
        for (let bin of bins) {
            let change = Math.floor(Math.random() * 20) - 5; // -5 to +15 fill change
            if(change > 0 && Math.random() < 0.2) change = -bin.fillLevel; // 20% chance of being completely emptied
            
            bin.fillLevel = Math.max(0, Math.min(100, bin.fillLevel + change));
            
            // Recalculate predictiion based on new fillLevel
            const hoursLeft = ((100 - bin.fillLevel) / 5); 
            const predicted = new Date();
            predicted.setHours(predicted.getHours() + hoursLeft);
            bin.predictedFull = predicted;
            
            await bin.save();
        }
        console.log('Bins successfully simulated');
    } catch(err) {
        console.error('Bin simulation failed', err);
    }
}, 10000); // 10 seconds

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

