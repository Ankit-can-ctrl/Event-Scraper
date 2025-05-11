import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="bg-dark min-h-screen text-white">
      <Router>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetail />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
