'use client';

import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';
import { WeatherData } from '../hooks/useWeather';

interface WeatherCardProps {
  weather: WeatherData;
  showDetails?: boolean;
  className?: string;
}

const defaults = {
  color: 'black',
  size: 64,
  animate: true,
};

export default function WeatherCard({ weather, showDetails = true, className = '' }: WeatherCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-gray-600">{weather.main}</p>
        </div>
        <ReactAnimatedWeather
          icon={weather.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Temperature</p>
            <p className="text-2xl font-bold">{weather.temperatureC}°C</p>
            <p className="text-gray-500 text-sm">{weather.temperatureF}°F</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Humidity</p>
            <p className="text-2xl font-bold">{weather.humidity}%</p>
          </div>
        </div>
      )}
    </div>
  );
} 