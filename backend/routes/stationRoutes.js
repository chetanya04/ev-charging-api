const express = require('express');
const { 
  createStation, 
  getStations, 
  updateStation, 
  deleteStation 
} = require('../controllers/stationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (if you want to allow viewing stations without auth)
router.get('/', getStations);

// Protected routes (require authentication)
router.post('/', authMiddleware, createStation);
router.put('/:id', authMiddleware, updateStation);
router.delete('/:id', authMiddleware, deleteStation);

module.exports = router;