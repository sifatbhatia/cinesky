'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { getWeatherIcon } from '../lib/weather-utils';
import { WeatherData } from '../types/weather';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      
      setWeather({
        lat,
        lon,
        city: data.name,
        location: `${data.name}, ${data.sys.country}`,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        main: data.weather[0].main,
        country: data.sys.country,
        icon: getWeatherIcon(data.weather[0].main),
        wind: {
          speed: data.wind.speed,
          direction: data.wind.deg.toString()
        },
        visibility: data.visibility / 1000, // Convert to kilometers
        pressure: data.main.pressure,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString()
      });
      
      setError(null);
    } catch (err) {
      setError('Error fetching weather data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    try {
      setLoading(true);
      
      const position = await getPosition();
      await getWeather(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      // If user denied location, use default location
      console.error('Location error:', err);
      setError('Location access denied. Using default location.');
      await getWeather(28.67, 77.22); // Default coordinates
    }
  };

  const fetchWeatherByCoordinates = async (lat: number, lon: number) => {
    await getWeather(lat, lon);
  };

  useEffect(() => {
    fetchWeatherByLocation();
    
    // Refresh weather data every 10 minutes
    const interval = setInterval(() => {
      if (weather?.lat && weather?.lon) {
        getWeather(weather.lat, weather.lon);
      }
    }, 600000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    weather,
    loading,
    error,
    fetchWeatherByLocation,
    fetchWeatherByCoordinates
  };
} 