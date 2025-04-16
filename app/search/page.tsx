'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import { api } from '../lib/api';
import {
  FiSearch,
  FiMapPin,
  FiThermometer,
  FiDroplet,
  FiWind,
  FiInfo,
  FiCompass
} from 'react-icons/fi';
import { getWeatherIcon } from '../lib/weather-utils';
import ReactAnimatedWeather from 'react-animated-weather';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const defaults = {
  color: '#3b82f6',
  size: 128,
  animate: true,
};

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai',
  'Toronto', 'Singapore', 'Berlin', 'Mumbai'
];

export default function WeatherSearch() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const searchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherData(query);
  };

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api.base}weather?q=${cityName}&units=metric&APPID=${api.key}`
      );

      if (!response.ok) {
        throw new Error('City not found. Please try another location.');
      }

      const data = await response.json();

      setWeather({
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: getWeatherIcon(data.weather[0].main),
        wind: data.wind?.speed || 0,
        feels_like: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
      });

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0F0F11] to-[#1A1A1E] text-white padding-container">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[64px] sm:text-[72px] font-extrabold tracking-tight leading-tight mb-4 text-white drop-shadow-lg">
            Weather Search
          </h1>
          <p className="text-secondary text-xl sm:text-2xl mb-12 max-w-3xl leading-relaxed">
            Search for any city around the world to get real-time weather information.
          </p>

          <form onSubmit={searchWeather} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-12">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full h-[64px] bg-[#1C1D22]/70 backdrop-blur-md rounded-full pl-14 pr-6 text-lg sm:text-xl text-white placeholder-secondary/50 border border-white/10 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                placeholder="Search for a city (e.g. London, New York...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            </div>
            <button
              type="submit"
              className="h-[64px] px-10 bg-primary hover:bg-primary-dark rounded-full text-white text-lg sm:text-xl font-semibold transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
          </form>

          {!weather && !loading && !error && (
            <div className="mb-12">
              <h3 className="text-secondary text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCompass size={22} />
                Popular Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setQuery(city);
                      fetchWeatherData(city);
                    }}
                    className="px-5 py-3 bg-[#1C1D22]/70 backdrop-blur-lg rounded-xl text-white text-lg font-medium hover:bg-[#1C1D22]/90 transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mb-10">
              <div className="flex items-start gap-4">
                <FiInfo className="mt-1 text-red-500" size={24} />
                <div>
                  <p className="text-xl font-semibold text-red-500 mb-1">Oops!</p>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8"></div>
              <p className="text-xl text-secondary">Searching for weather data...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="bg-[#1C1D22]/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
              <div className="p-12 bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex flex-wrap items-start justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FiMapPin className="text-primary" size={24} />
                      <h2 className="text-4xl font-bold text-white">
                        {weather.city}, {weather.country}
                      </h2>
                    </div>
                    <p className="text-2xl text-secondary capitalize">
                      {weather.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <ReactAnimatedWeather
                      icon={weather.icon}
                      color={defaults.color}
                      size={100}
                      animate={defaults.animate}
                    />
                    <div className="text-7xl font-bold text-white">
                      {weather.temperatureC}
                      <span className="text-2xl align-top ml-1">°C</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-[#1C1D22]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <FiThermometer size={20} />
                      <span className="text-base">Feels Like</span>
                    </div>
                    <p className="text-3xl font-semibold text-white">{weather.feels_like}°C</p>
                  </div>

                  <div className="bg-[#1C1D22]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <FiDroplet size={20} />
                      <span className="text-base">Humidity</span>
                    </div>
                    <p className="text-3xl font-semibold text-white">{weather.humidity}%</p>
                  </div>

                  <div className="bg-[#1C1D22]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                    <div className="flex items-center gap-2 text-secondary mb-2">
                      <FiWind size={20} />
                      <span className="text-base">Wind Speed</span>
                    </div>
                    <p className="text-3xl font-semibold text-white">{weather.wind} m/s</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
