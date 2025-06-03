const Station = require('../models/ChargingStation');

exports.createStation = async (req, res) => {
  const { name, latitude, longitude, status, powerOutput, connectorType } = req.body;

  if (!name || !latitude || !longitude || !status || !powerOutput || !connectorType) {
    return res.status(400).json({ 
      message: 'All fields are required: name, latitude, longitude, status, powerOutput, connectorType' 
    });
  }

  const station = await Station.create(req.body);
  res.status(201).json(station);
};

exports.getStations = async (req, res) => {
  const stations = await Station.find();
  res.json(stations);
};

// Update a charging station
exports.updateStation = async (req, res) => {
  const station = await Station.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true }
  );

  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }

  res.json(station);
};

// Delete a charging station
exports.deleteStation = async (req, res) => {
  const station = await Station.findByIdAndDelete(req.params.id);

  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }

  res.json({ message: 'Station deleted successfully' });
};