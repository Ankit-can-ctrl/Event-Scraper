// Update the scraping function to include the original URL
const scrapeEvents = async () => {
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
      // ... Keep other events and add originalUrl to each event ...
    ];
    
    return events;
  } catch (error) {
    console.error('Error scraping events:', error);
    return [];
  }
};

// Function to automatically update events
const startScraper = async (db) => {
  // First scrape to initialize data
  const initialEvents = await scrapeEvents();
  
  // Save all events to database
  for (const event of initialEvents) {
    const newEvent = new db.Event(event);
    await newEvent.save();
    console.log(`Added new event: ${event.title}`);
  }
  
  // Set up scheduled scraping (e.g., every 24 hours)
  // In a production environment, you would use a proper scheduler like node-cron
  const SCRAPE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  
  setInterval(async () => {
    try {
      console.log('Running scheduled event scraper...');
      const latestEvents = await scrapeEvents();
      
      // Check for new events and add them
      for (const event of latestEvents) {
        // Check if event already exists (by title and date)
        const existingEvent = await db.Event.findOne({ 
          title: event.title, 
          date: event.date 
        });
        
        if (!existingEvent) {
          // New event found, add to database
          const newEvent = new db.Event(event);
          await newEvent.save();
          console.log(`Added new event: ${event.title}`);
        } else if (existingEvent.originalUrl !== event.originalUrl) {
          // Update the existing event if originalUrl changes
          existingEvent.originalUrl = event.originalUrl;
          await existingEvent.save();
          console.log(`Updated originalUrl for event: ${event.title}`);
        }
      }
    } catch (error) {
      console.error('Error in scheduled scraper:', error);
    }
  }, SCRAPE_INTERVAL);
}; 