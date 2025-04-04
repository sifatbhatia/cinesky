'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import API from '../lib/api';

export default function GoldenHour() {
  const { currentUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [goldenHourData, setGoldenHourData] = useState({
    date: new Date(),
    sunrise: '',
    sunset: '',
    goldenMorningStart: '',
    goldenMorningEnd: '',
    goldenEveningStart: '',
    goldenEveningEnd: '',
    blueMorningStart: '',
    blueMorningEnd: '',
    blueEveningStart: '',
    blueEveningEnd: '',
  });
  const [nextDays, setNextDays] = useState<Array<Date>>([]);
  const [error, setError] = useState('');
  
  // Get today and next 6 days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    setNextDays(dates);
  }, []);
  
  useEffect(() => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({ 
            lat: position.coords.latitude, 
            lon: position.coords.longitude 
          });
          fetchLocationName(position.coords.latitude, position.coords.longitude);
          fetchGoldenHourData(position.coords.latitude, position.coords.longitude, new Date());
        },
        (err) => {
          console.error('Geolocation error:', err);
          setLoading(false);
          setError('Location access denied. Please enable location access or search for a location.');
        }
      );
    } else {
      setLoading(false);
      setError('Geolocation is not supported by this browser.');
    }
  }, [currentUser]);
  
  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `${API.base}weather?lat=${lat}&lon=${lon}&api_key=${API.key}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Weather API response was not successful');
      }
      
      // Extract location from timezone (e.g., "America/New_York" -> "New York, America")
      const timezone = result.data.timezone;
      const parts = timezone.split('/');
      
      if (parts.length >= 2) {
        const city = parts[parts.length - 1].replace(/_/g, ' ');
        const region = parts[0];
        setLocation(`${city}, ${region}`);
      } else {
        setLocation(timezone);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setError('Unable to determine location name.');
    }
  };
  
  const fetchGoldenHourData = async (lat: number, lon: number, date: Date) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch sunrise/sunset data from WeatherXu API
      const response = await fetch(
        `${API.base}weather?lat=${lat}&lon=${lon}&api_key=${API.key}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Weather API response was not successful');
      }
      
      // Get daily data from the response
      if (!result.data.daily || !result.data.daily.data || result.data.daily.data.length === 0) {
        throw new Error('Daily forecast data not available');
      }
      
      // Find the daily data for the selected date
      const today = new Date();
      
      // Since WeatherXu API returns forecasts with Unix timestamps as identifiers,
      // we need to find the forecast for the selected date
      const dayData = result.data.daily.data.find((day: any) => {
        const dayDate = new Date(day.forecastStart * 1000);
        return dayDate.toDateString() === date.toDateString();
      }) || result.data.daily.data[0]; // Use the first day if the selected date is not found
      
      if (!dayData || !dayData.sunriseTime || !dayData.sunsetTime) {
        throw new Error('Sunrise/sunset data not available');
      }
      
      // Calculate golden hour and blue hour times (approximately)
      const sunrise = new Date(dayData.sunriseTime * 1000);
      const sunset = new Date(dayData.sunsetTime * 1000);
      
      // Golden hour is typically the hour after sunrise and before sunset
      const goldenMorningStart = new Date(sunrise);
      const goldenMorningEnd = new Date(sunrise);
      goldenMorningEnd.setMinutes(goldenMorningEnd.getMinutes() + 60);
      
      const goldenEveningStart = new Date(sunset);
      goldenEveningStart.setMinutes(goldenEveningStart.getMinutes() - 60);
      const goldenEveningEnd = new Date(sunset);
      
      // Blue hour is typically the 20-30 minutes before sunrise and after sunset
      const blueMorningStart = new Date(sunrise);
      blueMorningStart.setMinutes(blueMorningStart.getMinutes() - 30);
      const blueMorningEnd = new Date(sunrise);
      
      const blueEveningStart = new Date(sunset);
      const blueEveningEnd = new Date(sunset);
      blueEveningEnd.setMinutes(blueEveningEnd.getMinutes() + 30);
      
      setGoldenHourData({
        date,
        sunrise: formatTime(sunrise),
        sunset: formatTime(sunset),
        goldenMorningStart: formatTime(goldenMorningStart),
        goldenMorningEnd: formatTime(goldenMorningEnd),
        goldenEveningStart: formatTime(goldenEveningStart),
        goldenEveningEnd: formatTime(goldenEveningEnd),
        blueMorningStart: formatTime(blueMorningStart),
        blueMorningEnd: formatTime(blueMorningEnd),
        blueEveningStart: formatTime(blueEveningStart),
        blueEveningEnd: formatTime(blueEveningEnd),
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching golden hour data:', error);
      setError('Failed to fetch golden hour data. Please try again later.');
      setLoading(false);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchLocation.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // First use geocoding to get coordinates
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=1&appid=74e7f04ba8b14cedf87c8585204020cc`
      );
      
      if (!geocodeResponse.ok) {
        throw new Error('Location not found');
      }
      
      const geoData = await geocodeResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found. Please check the spelling or try another location.');
      }
      
      const { lat, lon, name, country } = geoData[0];
      setLocation(`${name}, ${country}`);
      setCoordinates({ lat, lon });
      fetchGoldenHourData(lat, lon, goldenHourData.date);
    } catch (error) {
      console.error('Error searching location:', error);
      setError('Location not found. Please try a different search term.');
      setLoading(false);
    }
  };
  
  const selectDate = (date: Date) => {
    fetchGoldenHourData(coordinates.lat, coordinates.lon, date);
  };
  
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutesStr + ' ' + ampm;
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date: Date) => {
    return date.toDateString() === goldenHourData.date.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-navy">Golden Hour Finder</h1>
        <p className="text-navy max-w-3xl mb-8">
          Plan your perfect shots with precision timing for golden hour and blue hour.
          These magical times of day provide the warm, soft lighting that cinematographers love.
        </p>
        
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-navy mb-1">Location</h2>
              <p className="text-mauve font-medium">{location || 'Loading location...'}</p>
            </div>
            
            <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex gap-2">
              <input
                type="text"
                placeholder="Search location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="px-3 py-2 border border-lavender rounded-md focus:outline-none focus:ring-2 focus:ring-mauve"
              />
              <button 
                type="submit"
                disabled={loading || !searchLocation.trim()}
                className="btn-primary"
              >
                Search
              </button>
            </form>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
              {error}
            </div>
          )}
          
          <h3 className="text-navy mb-3">Select Date</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {nextDays.map((date, index) => (
              <button
                key={index}
                onClick={() => selectDate(date)}
                className={`px-3 py-2 rounded-md border transition-colors ${
                  isSelected(date)
                    ? 'bg-mauve text-white border-mauve'
                    : 'bg-white text-navy border-lavender hover:bg-lavender/10'
                }`}
              >
                {isToday(date) ? 'Today' : formatDate(date)}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
              <span className="ml-2 text-navy">Loading golden hour data...</span>
            </div>
          ) : (
            <div>
              <h2 className="text-navy mb-4">
                Golden Hour Times for {formatDate(goldenHourData.date)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-navy flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Golden Hour
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-navy font-medium mb-1">Morning Golden Hour</h4>
                      <p className="text-xl text-mauve">{goldenHourData.goldenMorningStart} - {goldenHourData.goldenMorningEnd}</p>
                      <p className="text-sm text-lavender mt-1">
                        Warm, directional light with soft shadows - perfect for atmospheric scenes
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-navy font-medium mb-1">Evening Golden Hour</h4>
                      <p className="text-xl text-mauve">{goldenHourData.goldenEveningStart} - {goldenHourData.goldenEveningEnd}</p>
                      <p className="text-sm text-lavender mt-1">
                        Rich, warm tones with long shadows - ideal for dramatic outdoor shots
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-navy flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Blue Hour
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-navy font-medium mb-1">Morning Blue Hour</h4>
                      <p className="text-xl text-mauve">{goldenHourData.blueMorningStart} - {goldenHourData.blueMorningEnd}</p>
                      <p className="text-sm text-lavender mt-1">
                        Subtle blue tones before sunrise - perfect for mood and mystery
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-navy font-medium mb-1">Evening Blue Hour</h4>
                      <p className="text-xl text-mauve">{goldenHourData.blueEveningStart} - {goldenHourData.blueEveningEnd}</p>
                      <p className="text-sm text-lavender mt-1">
                        Deep blue ambient light after sunset - great for cityscape and night transition scenes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-lavender/10 p-6 rounded-lg border border-lavender">
                <h3 className="text-navy mb-3">Key Times</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm text-lavender">Sunrise</h4>
                      <p className="text-navy font-medium">{goldenHourData.sunrise}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm text-lavender">Sunset</h4>
                      <p className="text-navy font-medium">{goldenHourData.sunset}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg mt-8 border border-taupe">
                <h3 className="text-navy mb-2">Cinematography Tips</h3>
                <ul className="list-disc list-inside text-navy space-y-1">
                  <li>Golden hour light is perfect for close-ups with soft, flattering illumination</li>
                  <li>Use a lens hood during golden hour to prevent lens flare (unless that's the effect you want)</li>
                  <li>Blue hour is ideal for city scenes where artificial lights can balance with the ambient light</li>
                  <li>Prepare your shots in advance as these optimal lighting periods are relatively short</li>
                  <li>During golden hour, position subjects with the sun behind them for beautiful rim lighting</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 