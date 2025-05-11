const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  ticketUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  sourceUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ venue: 1 });

module.exports = mongoose.model('Event', eventSchema); 