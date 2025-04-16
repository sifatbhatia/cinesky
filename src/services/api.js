// API service for CineCast application

// Get the API URL from environment variables or use a default
const API_URL = process.env.API_URL || 'https://weather-app-backend-4a2p.onrender.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// API service object with methods for different endpoints
const api = {
  // Get weather data for a location
  getWeather: async (location) => {
    try {
      const response = await fetch(`${API_URL}/api/weather?location=${encodeURIComponent(location)}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  // Get forecast data for a location
  getForecast: async (location) => {
    try {
      const response = await fetch(`${API_URL}/api/forecast?location=${encodeURIComponent(location)}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  },

  // Get film recommendations based on weather
  getFilmRecommendations: async (weatherData) => {
    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching film recommendations:', error);
      throw error;
    }
  },

  // Check API health
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
};

export default api; 