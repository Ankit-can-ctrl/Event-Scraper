const axios = require('axios');
const cheerio = require('cheerio');

// Multiple sources to scrape
const SOURCES = [
  {
    name: 'Eventbrite Sydney',
    url: 'https://www.eventbrite.com.au/d/australia--sydney/events/',
    selector: '.eds-event-card',
    parseEvent: ($, element) => {
      const title = $(element).find('.eds-event-card__formatted-name').text().trim();
      const date = $(element).find('.eds-event-card__formatted-date').text().trim();
      const venue = $(element).find('.eds-event-card__formatted-location').text().trim();
      const ticketUrl = $(element).find('a').attr('href');
      const imageUrl = $(element).find('img').attr('src');

      return {
        title,
        description: `Event at ${venue}`,
        date: new Date(date),
        venue,
        location: 'Sydney, Australia',
        ticketUrl,
        imageUrl,
        sourceUrl: SOURCES[0].url
      };
    }
  },
  {
    name: 'Sydney Opera House',
    url: 'https://www.sydneyoperahouse.com/events/whats-on.html',
    selector: '.event-card',
    parseEvent: ($, element) => {
      const title = $(element).find('.event-card__title').text().trim();
      const date = $(element).find('.event-card__date').text().trim();
      const venue = 'Sydney Opera House';
      const ticketUrl = $(element).find('a').attr('href');
      const imageUrl = $(element).find('img').attr('src');

      return {
        title,
        description: `Performance at the Sydney Opera House`,
        date: new Date(date),
        venue,
        location: 'Sydney Opera House, Sydney',
        ticketUrl,
        imageUrl,
        sourceUrl: SOURCES[1].url
      };
    }
  }
];

// Update the sample events with reliable image URLs
const sampleEvents = [
  {
    _id: '1',
    title: "Sydney Jazz Festival",
    description: "Annual jazz festival featuring local and international artists",
    date: new Date("2024-03-15"),
    venue: "Sydney Town Hall",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/jazz-festival",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '2',
    title: "Food & Wine Festival",
    description: "Celebrate Sydney's culinary scene with top chefs and winemakers",
    date: new Date("2024-04-20"),
    venue: "The Rocks",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/food-festival",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '3',
    title: "Tech Conference 2024",
    description: "Annual technology conference featuring industry leaders",
    date: new Date("2024-05-10"),
    venue: "International Convention Centre",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/tech-conference",
    imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '4',
    title: "Sydney Harbour Marathon",
    description: "Scenic marathon route around Sydney's iconic harbour",
    date: new Date("2024-06-12"),
    venue: "Sydney Harbour",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/sydney-marathon",
    imageUrl: "https://images.unsplash.com/photo-1540904579278-4d3c4b4e35b6?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '5',
    title: "Opera Under the Stars",
    description: "Open-air opera performance with Sydney Opera House backdrop",
    date: new Date("2024-02-28"),
    venue: "Royal Botanic Garden",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/opera-stars",
    imageUrl: "https://images.unsplash.com/photo-1526142684086-7ebd69df27a5?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '6',
    title: "Sydney Film Festival",
    description: "International film festival showcasing the best in world cinema",
    date: new Date("2024-08-05"),
    venue: "State Theatre",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/film-festival",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '7',
    title: "Comedy Night Live",
    description: "Stand-up comedy night featuring Australia's top comedians",
    date: new Date("2024-03-22"),
    venue: "Sydney Comedy Club",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/comedy-night",
    imageUrl: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '8',
    title: "Craft Beer Festival",
    description: "Taste craft beers from over 50 local breweries",
    date: new Date("2024-07-14"),
    venue: "Australian Technology Park",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/beer-festival",
    imageUrl: "https://images.unsplash.com/photo-1554127959-b04104f23bab?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '9',
    title: "Art Gallery Exhibition",
    description: "Contemporary art exhibition featuring local and international artists",
    date: new Date("2024-09-18"),
    venue: "Museum of Contemporary Art",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/art-exhibition",
    imageUrl: "https://images.unsplash.com/photo-1545033697-25d7568a9624?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  },
  {
    _id: '10',
    title: "Sydney Dance Festival",
    description: "Annual dance festival showcasing various styles from around the world",
    date: new Date("2024-04-08"),
    venue: "Sydney Dance Company",
    location: "Sydney, Australia",
    ticketUrl: "https://example.com/tickets/dance-festival",
    imageUrl: "https://images.unsplash.com/photo-1467307983825-619715426c70?q=80&w=800&h=600&auto=format&fit=crop",
    sourceUrl: "https://example.com/events"
  }
];

// Import MongoDB models if available
let Event;
try {
  Event = require('../models/eventModel');
} catch (err) {
  console.log('Event model not available, will use in-memory DB');
}

async function scrapeSource(source) {
  try {
    const response = await axios.get(source.url);
    const $ = cheerio.load(response.data);
    const events = [];

    $(source.selector).each((i, element) => {
      try {
        const event = source.parseEvent($, element);
        if (event.title && event.date && event.venue && event.ticketUrl) {
          event._id = Date.now() + i.toString(); // Create unique ID
          events.push(event);
        }
      } catch (error) {
        console.error(`Error parsing event from ${source.name}:`, error);
      }
    });

    return events;
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
    return [];
  }
}

async function saveEvents(events, db) {
  for (const event of events) {
    try {
      // Check if event already exists
      const existingEvent = db.events.find(e => 
        e.title === event.title && 
        e.date.toString() === event.date.toString() && 
        e.venue === event.venue
      );

      if (!existingEvent) {
        db.events.push(event);
        console.log(`Added new event: ${event.title}`);
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  }
}

async function scrapeEvents() {
  try {
    console.log('Starting event scraper...');
    
    // In a real application, this would be actual web scraping
    // For demo purposes, we're creating sample data
    const events = [
      {
        title: 'Sydney Jazz Festival',
        date: new Date('2024-11-15'),
        venue: 'Sydney Opera House',
        description: 'A celebration of jazz music featuring local and international artists.',
        imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=1000&auto=format&fit=crop',
        ticketPrice: 75,
        originalUrl: 'https://www.sydneyjazzfestival.com.au',
        category: 'Music',
        duration: '3 days',
        organizer: 'Sydney Arts Council'
      },
      {
        title: 'Food & Wine Festival',
        date: new Date('2024-10-20'),
        venue: 'Sydney Showground',
        description: 'Explore the finest food and wine from across Australia.',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
        ticketPrice: 55,
        originalUrl: 'https://www.sydneyfoodwine.com.au',
        category: 'Food & Drink',
        duration: '2 days',
        organizer: 'Sydney Food Council'
      },
      {
        title: 'Tech Conference 2024',
        date: new Date('2024-09-05'),
        venue: 'International Convention Centre',
        description: 'The biggest tech conference in the Southern Hemisphere.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
        ticketPrice: 120,
        originalUrl: 'https://www.sydneytechconf.com',
        category: 'Technology',
        duration: '3 days',
        organizer: 'Tech Sydney'
      },
      {
        title: 'Sydney Harbour Marathon',
        date: new Date('2024-08-12'),
        venue: 'Sydney Harbour Bridge',
        description: 'Run across the iconic Sydney Harbour Bridge in this annual marathon.',
        imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1000&auto=format&fit=crop',
        ticketPrice: 85,
        originalUrl: 'https://www.sydneymarathon.com',
        category: 'Sports',
        duration: '1 day',
        organizer: 'Sydney Running Club'
      },
      {
        title: 'Opera Under the Stars',
        date: new Date('2024-12-10'),
        venue: 'Botanic Gardens',
        description: 'An enchanting evening of opera in the beautiful Botanic Gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000&auto=format&fit=crop',
        ticketPrice: 95,
        originalUrl: 'https://www.sydneyopera.com.au/stars',
        category: 'Music',
        duration: '1 evening',
        organizer: 'Sydney Opera Company'
      }
    ];
    
    return events;
  } catch (error) {
    console.error('Error scraping events:', error);
    return [];
  }
}

// Function to automatically update events
const startScraper = async (db) => {
  try {
    console.log('Starting scraper with database:', db.constructor.name);
    
    // First scrape to initialize data
    const initialEvents = await scrapeEvents();
    console.log(`Scraped ${initialEvents.length} events`);
    
    // Save all events to database
    let savedCount = 0;
    
    // Handle different database types
    if (db.constructor.name === 'Mongoose') {
      // MongoDB mode
      for (const eventData of initialEvents) {
        try {
          // Check if event already exists
          const exists = await Event.findOne({ 
            title: eventData.title, 
            date: eventData.date 
          });
          
          if (!exists) {
            const newEvent = new Event(eventData);
            await newEvent.save();
            savedCount++;
            console.log(`Added new event to MongoDB: ${eventData.title}`);
          }
        } catch (err) {
          console.error(`Error saving event ${eventData.title}:`, err);
        }
      }
    } else {
      // In-memory mode
      for (const eventData of initialEvents) {
        // Check if event already exists
        const exists = db.events.some(e => 
          e.title === eventData.title && 
          new Date(e.date).toDateString() === new Date(eventData.date).toDateString()
        );
        
        if (!exists) {
          // Generate a simple _id
          const _id = Math.random().toString(36).substring(2, 15);
          db.events.push({
            ...eventData,
            _id,
            createdAt: new Date()
          });
          savedCount++;
          console.log(`Added new event to in-memory DB: ${eventData.title}`);
        }
      }
    }
    
    console.log(`Event scraping completed, saved ${savedCount} new events`);
    
    // Scheduled scraping is handled by the caller
  } catch (error) {
    console.error('Error in scraper:', error);
  }
};

module.exports = { 
  scrapeEvents,
  startScraper
}; 