const API = {
  key: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
  base: process.env.NEXT_PUBLIC_WEATHER_API_BASE || 'https://api.openweathermap.org/data/2.5/'
};

export default API; 