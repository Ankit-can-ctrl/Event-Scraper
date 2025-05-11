const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Register for an event
router.post('/:eventId', [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.params;
    const { email } = req.body;

    // Check if event exists
    const event = req.db.events.find(e => e._id === eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = req.db.registrations.find(r => 
      r.eventId === eventId && r.email === email
    );
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Create registration
    const registration = {
      _id: Date.now().toString(),
      eventId,
      email,
      createdAt: new Date().toISOString()
    };

    req.db.registrations.push(registration);

    res.status(201).json({
      message: 'Registration successful',
      redirectUrl: event.ticketUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get registrations for an event
router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = req.db.registrations
      .filter(r => r.eventId === req.params.eventId)
      .map(r => ({ email: r.email, createdAt: r.createdAt }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 