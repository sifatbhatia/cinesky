'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import API from '../lib/api';

type WeatherItem = {
  id: number;
  name: string;
  country: string;
  temp: number;
  description: string;
  main: string;
  humidity: number;
  wind: number;
};

export default function ListView() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weatherList, setWeatherList] = useState<WeatherItem[]>([]);
  const [error, setError] = useState('');
  
  // City coordinates instead of names
  const cityCoordinates = [
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777 }
  ];
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const weatherPromises = cityCoordinates.map(city => 
        fetch(`${API.base}weather?lat=${city.lat}&lon=${city.lon}&api_key=${API.key}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`Failed to fetch data for ${city.name}`);
            }
            return res.json();
          })
      );
      
      const results = await Promise.allSettled(weatherPromises);
      
      const weatherData = results
        .filter((result, index): result is PromiseFulfilledResult<any> => {
          if (result.status !== 'fulfilled') {
            console.error(`Failed to fetch data for ${cityCoordinates[index].name}`);
            return false;
          }
          return true;
        })
        .map((result, index) => {
          const data = result.value;
          
          if (!data.success) {
            console.error(`API error for ${cityCoordinates[index].name}`);
            return null;
          }
          
          return {
            id: data.data.dt,
            name: cityCoordinates[index].name,
            country: data.data.timezone.split('/')[0],
            temp: Math.round(data.data.currently.temperature),
            description: data.data.currently.icon.replace('_', ' '),
            main: data.data.currently.icon.replace('_', ' '),
            humidity: Math.round(data.data.currently.humidity * 100),
            wind: data.data.currently.windSpeed
          };
        })
        .filter(item => item !== null) as WeatherItem[];
      
      setWeatherList(weatherData);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-navy">Weather List</h1>
        
        <div className="mb-4 flex justify-between items-center">
          <p className="text-navy">
            View current weather conditions for major cities around the world.
          </p>
          <button 
            onClick={fetchWeatherData} 
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
            <span className="ml-2 text-navy">Loading weather data...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-navy text-sand">
                <tr>
                  <th className="py-3 px-4 text-left">City</th>
                  <th className="py-3 px-4 text-left">Weather</th>
                  <th className="py-3 px-4 text-left">Temperature</th>
                  <th className="py-3 px-4 text-left">Humidity</th>
                  <th className="py-3 px-4 text-left">Wind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lavender/30">
                {weatherList.map((item) => (
                  <tr key={item.id} className="hover:bg-lavender/10">
                    <td className="py-3 px-4">
                      <div className="font-medium text-navy">{item.name}</div>
                      <div className="text-xs text-lavender">{item.country}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-navy capitalize">{item.main}</div>
                      <div className="text-xs text-lavender capitalize">{item.description}</div>
                    </td>
                    <td className="py-3 px-4 text-mauve font-medium">
                      {item.temp}°C
                    </td>
                    <td className="py-3 px-4 text-lavender">
                      {item.humidity}%
                    </td>
                    <td className="py-3 px-4 text-lavender">
                      {item.wind} m/s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {weatherList.length === 0 && !loading && !error && (
              <div className="text-center p-6 text-lavender">
                No weather data available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 