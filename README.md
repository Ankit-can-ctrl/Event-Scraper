# Sydney Events Scraper

A web application that automatically scrapes and displays events from Sydney, Australia.

## Features

- Automatic event scraping from multiple sources
- Beautiful event display with details
- Email collection for ticket redirection
- Real-time updates
- Responsive design

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sydney-events
NODE_ENV=development
```

3. Start MongoDB:

```bash
# Make sure MongoDB is installed and running on your system
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

- `src/` - Source code
  - `server.js` - Main application file
  - `models/` - MongoDB models
  - `routes/` - API routes
  - `scraper/` - Web scraping modules
- `frontend/` - React frontend code (to be implemented)
  - `src/` - React source files
  - `public/` - Static assets

## API Endpoints

### Events

- `GET /api/events` - Get all events (with pagination)
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/search/:query` - Search events

### Registrations

- `POST /api/registrations/:eventId` - Register for an event
- `GET /api/registrations/event/:eventId` - Get registrations for an event

## Technologies Used

- Backend: Node.js, Express, MongoDB
- Frontend: React (to be implemented)
- Web Scraping: Cheerio, Axios
- Database: MongoDB
- Task Scheduling: node-cron
