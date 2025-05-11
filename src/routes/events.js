const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Get all events with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const events = req.db.events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(skip, skip + limit);
    
    const total = req.db.events.length;

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalEvents: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = req.db.events.find(e => e._id === req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search events
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const events = req.db.events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query)
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 