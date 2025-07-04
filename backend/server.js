const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path')

const app = express();
const _dirname = path.resolve()

// Middleware
app.use(cors());
app.use(express.json());
const corsOption = {
  origin: "https://ev-charging-api-j4kg.onrender.com/",
  Credentials: true
}
app.use(cors(corsOption))


// Import routes
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"))
})

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'EV Charging Station API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

module.exports = app;