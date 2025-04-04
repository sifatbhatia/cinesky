'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Clock from 'react-live-clock';
import ReactAnimatedWeather from 'react-animated-weather';
import Navbar from '../components/Navbar';
import API from '../lib/api';
import Image from 'next/image';

// Weather icon defaults
const defaults = {
  color: '#0B1D51', // navy color
  size: 112,
  animate: true,
};

// Date builder helper function
const dateBuilder = (d: Date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

// Calculate Golden Hour times (simplified example)
const calculateGoldenHour = (sunrise: number, sunset: number) => {
  const morningGoldenStart = new Date(sunrise * 1000);
  const morningGoldenEnd = new Date(sunrise * 1000);
  morningGoldenEnd.setMinutes(morningGoldenEnd.getMinutes() + 60); // Golden hour typically lasts about an hour
  
  const eveningGoldenStart = new Date(sunset * 1000);
  eveningGoldenStart.setMinutes(eveningGoldenStart.getMinutes() - 60); // An hour before sunset
  const eveningGoldenEnd = new Date(sunset * 1000);
  
  return {
    morning: {
      start: formatTime(morningGoldenStart),
      end: formatTime(morningGoldenEnd)
    },
    evening: {
      start: formatTime(eveningGoldenStart),
      end: formatTime(eveningGoldenEnd)
    }
  };
};

// Format time
const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutesStr + ' ' + ampm;
};

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    lat: undefined as number | undefined,
    lon: undefined as number | undefined,
    temperatureC: undefined as number | undefined,
    temperatureF: undefined as number | undefined,
    city: undefined as string | undefined,
    country: undefined as string | undefined,
    humidity: undefined as number | undefined,
    main: undefined as string | undefined,
    icon: 'CLEAR_DAY' as string,
    visibility: undefined as number | undefined,
    clouds: undefined as number | undefined,
    sunrise: undefined as number | undefined,
    sunset: undefined as number | undefined,
    uvi: undefined as number | undefined,
  });
  
  const [goldenHours, setGoldenHours] = useState({
    morning: { start: '', end: '' },
    evening: { start: '', end: '' }
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (navigator.geolocation) {
      getPosition()
        .then((position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          // Default location if user denies permission
          getWeather(28.67, 77.22);
          console.error('Geolocation error:', err);
          alert(
            'You have disabled location service. Allow this app to access your location. Your current location will be used for calculating real-time weather.'
          );
        });
    } else {
      alert('Geolocation not available');
    }

    // Refresh weather data every 10 minutes
    const intervalId = setInterval(() => {
      if (weatherData.lat && weatherData.lon) {
        getWeather(weatherData.lat, weatherData.lon);
      }
    }, 600000);

    return () => clearInterval(intervalId);
  }, []);

  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const getWeather = async (lat: number, lon: number) => {
    try {
      // Get weather data from WeatherXu API
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
      
      setWeatherData({
        lat,
        lon,
        city: data.data.timezone.split('/')[1].replace('_', ' '),
        temperatureC: Math.round(data.data.currently.temperature),
        temperatureF: Math.round((data.data.currently.temperature * 9/5) + 32),
        humidity: data.data.currently.humidity,
        main: data.data.currently.icon.replace('_', ' '),
        country: data.data.timezone.split('/')[0],
        icon: getWeatherIcon(data.data.currently.icon),
        visibility: data.data.currently.visibility / 1000, // Convert to km
        clouds: data.data.currently.cloudCover * 100, // Convert to percentage
        sunrise: data.data.daily?.data[0]?.sunriseTime,
        sunset: data.data.daily?.data[0]?.sunsetTime,
        uvi: data.data.currently.uvIndex
      });
      
      // Calculate golden hours if sunrise and sunset data are available
      if (data.data.daily?.data[0]?.sunriseTime && data.data.daily?.data[0]?.sunsetTime) {
        setGoldenHours(calculateGoldenHour(
          data.data.daily.data[0].sunriseTime, 
          data.data.daily.data[0].sunsetTime
        ));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
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

  // Helper to determine if it's currently golden hour
  const isGoldenHourNow = () => {
    if (!weatherData.sunrise || !weatherData.sunset) return false;
    
    const now = new Date();
    const morningStart = new Date(weatherData.sunrise * 1000);
    const morningEnd = new Date(weatherData.sunrise * 1000);
    morningEnd.setMinutes(morningEnd.getMinutes() + 60);
    
    const eveningStart = new Date(weatherData.sunset * 1000);
    eveningStart.setMinutes(eveningStart.getMinutes() - 60);
    const eveningEnd = new Date(weatherData.sunset * 1000);
    
    return (now >= morningStart && now <= morningEnd) || 
           (now >= eveningStart && now <= eveningEnd);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-sand">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-navy" />
        <h3 className="ml-4 text-2xl font-semibold text-navy">Detecting your location</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-navy">CineSky Dashboard</h1>
        {currentUser && currentUser.displayName && (
          <h2 className="mb-6 text-navy">Hello, {currentUser.displayName}</h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-white rounded-lg shadow-lg p-6 border border-mauve">
            <div className="text-center">
              <h2 className="mb-4 text-navy">
                {weatherData.city}, {weatherData.country}
              </h2>
            </div>
            
            <div className="flex justify-center mb-4">
              <ReactAnimatedWeather
                icon={weatherData.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
            </div>

            <div className="text-center">
              <h3 className="text-navy">{weatherData.main}</h3>
              
              <div className="my-4">
                <div className="text-xl font-medium text-navy">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="text-lavender">
                  {dateBuilder(new Date())}
                </div>
              </div>
              
              <div className="text-4xl font-bold text-mauve">
                {weatherData.temperatureC}°<span>C</span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-left">
                  <p className="text-sm text-lavender">Humidity</p>
                  <p className="text-xl text-navy">{weatherData.humidity}%</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-lavender">Visibility</p>
                  <p className="text-xl text-navy">{weatherData.visibility} km</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-lavender">Cloud Cover</p>
                  <p className="text-xl text-navy">{weatherData.clouds}%</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-lavender">UV Index</p>
                  <p className="text-xl text-navy">{weatherData.uvi}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filmmaker-specific card */}
          <div className="card bg-white rounded-lg shadow-lg p-6 border border-mauve">
            <h2 className="mb-4 text-navy text-center">Cinematography Conditions</h2>
            
            <div className={`p-4 mb-4 rounded-lg ${isGoldenHourNow() ? 'bg-yellow-100 border border-yellow-300' : 'bg-lavender/10 border border-lavender'}`}>
              <h3 className="text-navy mb-2 flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-mauve" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </span>
                Golden Hour Times
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-lavender">Morning</p>
                  <p className="font-medium text-navy">{goldenHours.morning.start} - {goldenHours.morning.end}</p>
                </div>
                <div>
                  <p className="text-sm text-lavender">Evening</p>
                  <p className="font-medium text-navy">{goldenHours.evening.start} - {goldenHours.evening.end}</p>
                </div>
              </div>
              
              {isGoldenHourNow() && (
                <div className="mt-2 text-sm bg-yellow-200 text-yellow-800 p-1 rounded text-center">
                  Golden hour is happening now!
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-navy mb-2">Light Conditions</h3>
                <div className="bg-gray-200 h-2 rounded-full">
                  <div 
                    className="bg-gradient-to-r from-navy to-mauve h-2 rounded-full" 
                    style={{ width: `${100 - (weatherData.clouds || 0)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-lavender mt-1">
                  <span>Overcast</span>
                  <span>Clear</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-navy mb-2">Shooting Recommendations</h3>
                <ul className="list-disc list-inside text-navy space-y-1">
                  {weatherData.clouds && weatherData.clouds > 70 && (
                    <li>Diffused lighting ideal for portraits</li>
                  )}
                  {weatherData.clouds && weatherData.clouds < 30 && (
                    <li>Strong shadows, consider using diffusers</li>
                  )}
                  {weatherData.visibility && weatherData.visibility < 5 && (
                    <li>Limited visibility, fog effects may be enhanced</li>
                  )}
                  {weatherData.uvi && weatherData.uvi > 6 && (
                    <li>High UV, protect equipment and use ND filters</li>
                  )}
                  {isGoldenHourNow() && (
                    <li className="text-mauve font-medium">Golden hour is now - ideal for warm, soft lighting</li>
                  )}
                </ul>
              </div>
              
              <div className="text-center mt-6">
                <a href="/golden-hour" className="btn-primary inline-block">
                  View Detailed Forecast
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 