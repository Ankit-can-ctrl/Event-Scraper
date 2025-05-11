import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

// Fallback image if the event image fails to load
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&h=600&auto=format&fit=crop';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchEvents = async (pageNum = 1, query = '') => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching events...');
      
      // Use environment variable for API URL or fallback to localhost
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const url = query
        ? `${API_URL}/events/search/${query}`
        : `${API_URL}/events?page=${pageNum}`;
      
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      
      if (query) {
        setEvents(response.data || []);
        setTotalPages(1);
      } else {
        setEvents(response.data.events || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents(1, searchQuery);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const handleImageError = (e) => {
    console.log('Image failed to load, using fallback');
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-dark">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="flex flex-col items-center mb-8">
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary flex-1"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg text-blue-200">
            No events found. Try adjusting your search or check back later.
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="card"
            >
              <img
                src={event.imageUrl || FALLBACK_IMAGE}
                alt={event.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                }}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-center text-white">
                  {event.title}
                </h2>
                <p className="text-gray-400 text-center mb-1">
                  {formatDate(event.date)}
                </p>
                <p className="text-gray-400 text-center mb-4">
                  {event.venue}
                </p>
                <button
                  onClick={() => navigate(`/event/${event._id}`)}
                  className="btn-primary w-full"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!searchQuery && !error && events.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === index + 1
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-gray-400 hover:bg-gray-700'
                  } transition-all duration-200`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventList; 