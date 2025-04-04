'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import API from '../lib/api';
import ReactAnimatedWeather from 'react-animated-weather';

// Weather icon defaults
const defaults = {
  color: '#0B1D51',
  size: 50,
  animate: true,
};

export default function Timeline() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLoading(false);
          setError('Location access denied. Please enable location access.');
        }
      );
    } else {
      setLoading(false);
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `${API.base}weather?lat=${lat}&lon=${lon}&api_key=${API.key}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Weather API response was not successful');
      }
      
      // Set location from timezone
      const timezone = data.data.timezone;
      const parts = timezone.split('/');
      
      if (parts.length >= 2) {
        const city = parts[parts.length - 1].replace(/_/g, ' ');
        const region = parts[0];
        setLocation(`${city}, ${region}`);
      } else {
        setLocation(timezone);
      }
      
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
      setError('Failed to fetch weather data. Please try again later.');
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-navy mb-6">Weather Timeline</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
            <span className="ml-2 text-navy">Loading weather data...</span>
          </div>
        ) : (
          weatherData && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-navy mb-2">{location}</h2>
                <p className="text-lavender">16-day weather forecast</p>
              </div>
              
              <div className="mb-8 overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                  <thead className="bg-navy text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-center">Condition</th>
                      <th className="py-3 px-4 text-center">Temperature</th>
                      <th className="py-3 px-4 text-center">Humidity</th>
                      <th className="py-3 px-4 text-center">Wind</th>
                      <th className="py-3 px-4 text-center">Sunrise/Sunset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherData.data.daily.data.map((day: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 border-b">
                          <div className="font-medium">{formatDate(day.forecastStart)}</div>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <div className="flex flex-col items-center">
                            <ReactAnimatedWeather
                              icon={getWeatherIcon(day.icon || 'clear')}
                              color={defaults.color}
                              size={defaults.size}
                              animate={defaults.animate}
                            />
                            <span className="text-sm mt-1">{day.icon?.replace('_', ' ') || 'Clear'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          <div className="flex flex-col">
                            <span className="font-medium">{Math.round(day.temperatureMax)}°C</span>
                            <span className="text-sm text-gray-500">{Math.round(day.temperatureMin)}°C</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {Math.round(day.humidity * 100)}%
                        </td>
                        <td className="py-3 px-4 border-b text-center">
                          {Math.round(day.windSpeedAvg)} m/s
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                              </svg>
                              <span>
                                {new Date(day.sunriseTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center justify-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                              </svg>
                              <span>
                                {new Date(day.sunsetTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl text-navy mb-4">Weather Trends</h2>
                <div className="h-60 relative">
                  {/* This would be a chart in a real application */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Temperature and precipitation chart would be displayed here
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg text-navy mb-3">Forecast Highlights</h3>
                  <ul className="space-y-2 text-navy">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Highest temperature: {Math.round(Math.max(...weatherData.data.daily.data.map((d: any) => d.temperatureMax)))}°C on {formatDate(weatherData.data.daily.data.reduce((prev: any, curr: any) => (prev.temperatureMax > curr.temperatureMax ? prev : curr)).forecastStart)}</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Lowest temperature: {Math.round(Math.min(...weatherData.data.daily.data.map((d: any) => d.temperatureMin)))}°C on {formatDate(weatherData.data.daily.data.reduce((prev: any, curr: any) => (prev.temperatureMin < curr.temperatureMin ? prev : curr)).forecastStart)}</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>{weatherData.data.daily.data.some((d: any) => d.icon?.includes('rain')) ? 'Rain expected during the forecast period' : 'No significant precipitation expected'}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg text-navy mb-3">Planning Tips</h3>
                  <ul className="space-y-2 text-navy">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Best days for outdoor activities: {weatherData.data.daily.data.filter((d: any) => !d.icon?.includes('rain') && d.temperatureMax > 20).slice(0, 3).map((d: any) => formatDate(d.forecastStart)).join(', ') || 'Check back later'}</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Days to avoid for photography: {weatherData.data.daily.data.filter((d: any) => d.icon?.includes('rain') || d.cloudCover > 0.8).slice(0, 3).map((d: any) => formatDate(d.forecastStart)).join(', ') || 'None'}</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Check out our <a href="/golden-hour" className="text-mauve hover:underline">Golden Hour Planner</a> for perfect lighting conditions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
} 