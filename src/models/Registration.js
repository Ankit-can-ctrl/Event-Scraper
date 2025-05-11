const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create compound index for event and email
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema); 