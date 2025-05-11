import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

// Fallback image if the event image fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&h=600&auto=format&fit=crop';

function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        // Use environment variable for API URL or fallback to localhost
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_URL}/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  const openTicketModal = () => {
    setIsModalOpen(true);
    setEmailError('');
    setSubmitSuccess(false);
  };

  const closeTicketModal = () => {
    setIsModalOpen(false);
    setEmail('');
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Use environment variable for API URL or fallback to localhost
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Send email to backend
      console.log('Submitting email:', email, 'for event:', id);
      const response = await axios.post(`${API_URL}/tickets`, {
        eventId: id,
        email: email,
      });
      
      console.log('Response from server:', response.data);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect to original site after a delay
      setTimeout(() => {
        // Use the original URL from response or fallback to a default URL
        const redirectUrl = response.data?.originalUrl || event.originalUrl || `https://www.sydney.com/events/${event.title.toLowerCase().replace(/\s+/g, '-')}`;
        console.log('Redirecting to:', redirectUrl);
        window.open(redirectUrl, '_blank');
        closeTicketModal();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting email:', error);
      const errorMessage = error.response?.data?.error || 'Failed to process your request. Please try again later.';
      setEmailError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
        {error || 'Event not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-400 hover:text-primary transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to events
      </button>

      {/* Event Card */}
      <div className="overflow-hidden rounded-2xl bg-dark-lighter shadow-xl">
        {/* Event Image */}
        <div className="relative h-72 md:h-96">
          <img
            src={event.imageUrl || FALLBACK_IMAGE}
          alt={event.title}
            className="w-full h-full object-cover"
          onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-lighter via-transparent to-transparent"></div>
        </div>

        {/* Event Details */}
        <div className="relative -mt-16 mx-4">
          <div className="bg-dark-lighter p-6 rounded-xl shadow-lg border border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {event.venue}
              </div>
            </div>

            <div className="bg-dark rounded-lg p-5 shadow-inner mb-5">
              <h2 className="text-lg font-semibold text-primary mb-2">Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {event.description || 'No description available for this event.'}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-xl font-semibold text-white">{event.ticketPrice ? `$${event.ticketPrice}` : 'Contact for price'}</p>
              </div>
              <button 
                className="btn-primary"
                onClick={openTicketModal}
              >
                GET TICKETS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-lighter p-5 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-primary mb-3">Event Type</h3>
          <p className="text-gray-300">{event.category || 'General'}</p>
        </div>
        <div className="bg-dark-lighter p-5 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-primary mb-3">Duration</h3>
          <p className="text-gray-300">{event.duration || 'Not specified'}</p>
        </div>
        <div className="bg-dark-lighter p-5 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-primary mb-3">Organizer</h3>
          <p className="text-gray-300">{event.organizer || 'Not specified'}</p>
        </div>
      </div>

      {/* Email Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-dark-lighter rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-700 relative">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={closeTicketModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-4">Get Tickets</h2>
            <p className="text-gray-300 mb-6">Enter your email to receive ticket information for <span className="text-primary">{event.title}</span>.</p>
            
            {!submitSuccess ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
                  <input
              type="email"
                    id="email"
                    className="input-primary w-full"
                    placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                  />
                  {emailError && (
                    <p className="text-red-400 mt-2 text-sm">{emailError}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" required />
                    <span className="ml-2 text-gray-300 text-sm">I agree to receive information about this event</span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Continue to Tickets'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-900/30 text-green-300 p-4 rounded-lg mb-4">
                  <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Success! Redirecting you to the ticket site...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail; 