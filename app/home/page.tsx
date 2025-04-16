'use client';

import React, { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { dateBuilder } from '../lib/weather-utils';
import Clock from 'react-live-clock';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiWind, FiDroplet, FiMapPin, FiSearch, FiSun, FiCloud, 
  FiX, FiHome, FiMap, FiLogOut, FiList, FiCompass, 
  FiArrowUp, FiArrowDown, FiThermometer, FiActivity, FiUser,
  FiEye, FiSunrise, FiClock, FiCalendar, FiMoon
} from 'react-icons/fi';
import Link from 'next/link';
import { WeatherData } from '../types/weather';
import Navbar from '../components/navbar';

export default function Home() {
  const { weather, loading, error } = useWeather();
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [timelineHour, setTimelineHour] = useState(0);
  const [activeTab, setActiveTab] = useState('today');

  // Update date time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Calculate golden hour times (approximation)
  const getGoldenHours = () => {
    const now = new Date();
    const sunrise = new Date(now);
    const sunset = new Date(now);
    
    // Placeholder values - in a real app, these would come from an API
    sunrise.setHours(6, 30, 0);
    sunset.setHours(19, 15, 0);
    
    const morningGoldenStart = new Date(sunrise);
    morningGoldenStart.setMinutes(sunrise.getMinutes() + 30);
    
    const morningGoldenEnd = new Date(sunrise);
    morningGoldenEnd.setHours(sunrise.getHours() + 1);
    
    const eveningGoldenStart = new Date(sunset);
    eveningGoldenStart.setHours(sunset.getHours() - 1);
    
    const eveningGoldenEnd = new Date(sunset);
    eveningGoldenEnd.setMinutes(sunset.getMinutes() - 30);
    
    return {
      sunrise: sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      morningGolden: {
        start: morningGoldenStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: morningGoldenEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      eveningGolden: {
        start: eveningGoldenStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: eveningGoldenEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      blueHour: {
        start: sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: new Date(sunset.getTime() + 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    };
  };

  // Timeline hours data
  const getTimelineData = () => {
    const hours = [];
    const currentHour = dateTime.getHours();
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      const temp = Math.round(weather?.temperatureC ?? 20) + Math.floor(Math.sin(i/3) * 4);
      const conditions = i % 12 === 0 ? 'Clear' : i % 8 === 0 ? 'Cloudy' : i % 6 === 0 ? 'Rain' : 'Clear';
      const visibility = 85 + Math.floor(Math.sin(i/6) * 10);
      const humidity = weather?.humidity ?? 50 + Math.floor(Math.sin(i/4) * 10);
      const uv = Math.floor(3 + Math.sin(i/2) * 3);
      
      hours.push({
        hour: hour,
        temp: temp,
        conditions: conditions,
        visibility: visibility,
        humidity: humidity,
        uv: uv,
        luminance: hour >= 6 && hour <= 18 ? (70 + Math.floor(Math.sin((hour-6)/12 * Math.PI) * 30)) : 0
      });
    }
    
    return hours;
  };
  
  const timelineData = getTimelineData();
  const goldenHours = getGoldenHours();

  // Function to determine if it's currently golden hour
  const isGoldenHourNow = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      (timeStr >= goldenHours.morningGolden.start && timeStr <= goldenHours.morningGolden.end) ||
      (timeStr >= goldenHours.eveningGolden.start && timeStr <= goldenHours.eveningGolden.end)
    );
  };

  // Check if it's blue hour
  const isBlueHourNow = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      timeStr >= goldenHours.blueHour.start && timeStr <= goldenHours.blueHour.end
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiSun className="text-accent" size={32} />
          </div>
        </div>
        <h3 className="text-2xl font-medium mt-6">Loading weather data...</h3>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-24">
        {weather ? (
          <>
            <div className="weather-header">
              <div className="location-info">
                <h1>{weather.city}</h1>
                <div className="location-detail">
                  <FiMapPin />
                  <span>{weather.country}</span>
                </div>
              </div>
              
              <div className="current-time">
                <div className="date">{dateBuilder(dateTime)}</div>
                <div className="time">
                  <FiClock />
                  <Clock format="h:mm A" interval={1000} ticking={true} />
                </div>
              </div>
            </div>

            <div className="weather-grid">
              <div className="weather-main">
                <div className="weather-primary">
                  <div className="weather-icon">
                    {weather.main === "Clear" ? (
                      <FiSun className="text-accent" />
                    ) : (
                      <FiCloud className="text-accent" />
                    )}
                  </div>
                  <div className="weather-temp">
                    <span className="temp">{Math.round(weather.temperatureC ?? 0)}</span>
                    <span className="unit">°C</span>
                  </div>
                  <div className="weather-desc">{weather.main}</div>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <FiDroplet />
                    <span className="label">Humidity</span>
                    <span className="value">{weather.humidity ?? 0}%</span>
                  </div>
                  <div className="detail-item">
                    <FiWind />
                    <span className="label">Wind</span>
                    <span className="value">{weather?.wind?.speed ?? 0} m/s</span>
                  </div>
                  <div className="detail-item">
                    <FiEye />
                    <span className="label">Visibility</span>
                    <span className="value">{weather?.visibility ?? 0} km</span>
                  </div>
                </div>
              </div>

              <div className="golden-hours">
                <h3>
                  <FiSunrise className="icon" />
                  Golden Hours
                </h3>
                <div className="golden-grid">
                  <div className="golden-item">
                    <span className="time">05:45 AM</span>
                    <span className="label">Sunrise</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">07:15 AM</span>
                    <span className="label">Golden Hour</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">06:30 PM</span>
                    <span className="label">Golden Hour</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">08:15 PM</span>
                    <span className="label">Sunset</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="error-container">
            <FiCloud className="error-icon" />
            <h2>Unable to load weather data</h2>
            <p>{error}</p>
          </div>
        ) : null}
      </main>
    </div>
  );
} 