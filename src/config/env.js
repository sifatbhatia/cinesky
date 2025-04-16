// Environment configuration for CineCast application

const env = {
  // API URL from environment variable or default
  API_URL: process.env.API_URL || 'https://weather-app-backend-4a2p.onrender.com',
  
  // Frontend URL from environment variable or default
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cinecast.netlify.app',
  
  // Application name
  APP_NAME: 'CineCast',
  
  // Version
  VERSION: '2.0.0',
  
  // Default location (can be overridden by user)
  DEFAULT_LOCATION: 'London, UK',
  
  // Weather API settings
  WEATHER: {
    UNITS: 'metric', // metric or imperial
    LANGUAGE: 'en',
    FORECAST_DAYS: 5
  },
  
  // Film recommendation settings
  FILMS: {
    MAX_RECOMMENDATIONS: 5,
    CATEGORIES: ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi']
  },
  
  // UI settings
  UI: {
    THEME: 'light', // light or dark
    ANIMATIONS: true
  }
};

export default env; 