'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import API from '../lib/api';
import ReactAnimatedWeather from 'react-animated-weather';

// Weather icon defaults
const defaults = {
  color: '#0B1D51', // navy color
  size: 112,
  animate: true,
};

export default function Search() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setWeather(null);
    
    try {
      // Use WeatherXu's API directly with the query parameter
      const weatherResponse = await fetch(
        `${API.base}weather?q=${query}&api_key=${API.key}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Location not found. Please try again.');
      }
      
      const data = await weatherResponse.json();
      
      if (!data.success) {
        throw new Error('Weather API response was not successful');
      }
      
      setWeather(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch weather data');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCondition: string): string => {
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes('clear')) {
      return 'CLEAR_DAY';
    } else if (condition.includes('cloud') || condition.includes('partly_cloudy')) {
      return 'CLOUDY';
    } else if (condition.includes('rain')) {
      return 'RAIN';
    } else if (condition.includes('snow')) {
      return 'SNOW';
    } else if (condition.includes('wind')) {
      return 'WIND';
    } else if (condition.includes('fog')) {
      return 'FOG';
    } else if (condition.includes('storm') || condition.includes('thunder')) {
      return 'WIND';
    } else {
      return 'CLEAR_DAY';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-navy">Search Weather</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter city name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-4 py-2 rounded-md border border-lavender focus:outline-none focus:ring-2 focus:ring-mauve"
            />
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        {weather && (
          <div className="card max-w-md mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-navy">
                {weather.data.timezone.split('/')[1].replace('_', ' ')}, {weather.data.timezone.split('/')[0]}
              </h2>
            </div>
            
            <div className="flex justify-center mb-4">
              <ReactAnimatedWeather
                icon={getWeatherIcon(weather.data.currently.icon)}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
            </div>
            
            <div className="text-center">
              <h2 className="text-xl text-navy">{weather.data.currently.icon.replace('_', ' ')}</h2>
              
              <div className="text-4xl font-bold my-4 text-mauve">
                {Math.round(weather.data.currently.temperature)}°<span>C</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-left">
                  <p className="text-navy font-medium">Feels Like</p>
                  <p className="text-lavender">{Math.round(weather.data.currently.apparentTemperature)}°C</p>
                </div>
                <div className="text-left">
                  <p className="text-navy font-medium">Humidity</p>
                  <p className="text-lavender">{weather.data.currently.humidity * 100}%</p>
                </div>
                <div className="text-left">
                  <p className="text-navy font-medium">Wind</p>
                  <p className="text-lavender">{weather.data.currently.windSpeed} m/s</p>
                </div>
                <div className="text-left">
                  <p className="text-navy font-medium">Pressure</p>
                  <p className="text-lavender">{weather.data.currently.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 