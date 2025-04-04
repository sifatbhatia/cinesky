'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import API from '../lib/api';
import Script from 'next/script';
import { useTheme } from '../contexts/ThemeContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

declare module 'leaflet';

export default function MapView() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (mapInitialized) return; // Prevent re-initialization

    // Get user's location or set default coordinates
    const latitude = 40.7128; // Default to New York
    const longitude = -74.0060;

    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 10);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    setMapInitialized(true); // Mark map as initialized
  }, [mapInitialized]);

  const initMap = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if L (Leaflet) is available
      if (typeof window !== 'undefined' && window.L)  {
        // Get current position
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            // Initialize the map
            const map = L.map('map').setView([latitude, longitude], 10);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add a marker for the user's location
            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup("<b>Your Location</b>").openPopup();
            
            // Fetch weather data for the map
            fetchWeatherData(latitude, longitude, map);
          },
          (err) => {
            console.error('Geolocation error:', err);
            // Default to New York if geolocation fails
            const defaultLat = 40.7128;
            const defaultLon = -74.0060;
            
            const map = L.map('map').setView([defaultLat, defaultLon], 10);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            fetchWeatherData(defaultLat, defaultLon, map);
          }
        );
      } else {
        throw new Error('Leaflet library failed to load');
      }
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to load map. Please try again later.');
      setLoading(false);
    }
  };
  
  const fetchWeatherData = async (lat, lon, map) => {
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
      
      // Add weather data to the map
      // This is a simplified example - in a real app, you would create 
      // markers for each location with weather data
      
      // Example: Add temperature markers for nearby cities
      const cities = [
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
        { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777 }
      ];
      
      // Only show cities that are relatively close to the user's location
      // (This is a simplified example)
      const nearbyCity = cities.find(city => {
        const distance = Math.sqrt(
          Math.pow(city.lat - lat, 2) + 
          Math.pow(city.lon - lon, 2)
        );
        return distance < 20; // Arbitrary distance threshold
      }) || cities[0]; // Default to first city if none are nearby
      
      // Add a marker for the nearby city
      const cityMarker = L.marker([nearbyCity.lat, nearbyCity.lon]).addTo(map);
      
      // Temperature display
      const tempIcon = L.divIcon({
        className: 'temp-icon',
        html: `<div style="background-color: rgba(255,255,255,0.8); padding: 5px; border-radius: 4px; font-weight: bold;">${Math.round(data.data.currently.temperature)}°C</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10]
      });
      
      L.marker([nearbyCity.lat, nearbyCity.lon], { icon: tempIcon }).addTo(map);
      
      // Add a simple weather layer (circle with color based on condition)
      const weatherCondition = data.data.currently.icon;
      let circleColor = '#f0f9ff'; // Default light blue
      
      if (weatherCondition.includes('clear')) {
        circleColor = '#fde047'; // Yellow for clear/sunny
      } else if (weatherCondition.includes('cloud')) {
        circleColor = '#94a3b8'; // Gray for cloudy
      } else if (weatherCondition.includes('rain')) {
        circleColor = '#3b82f6'; // Blue for rain
      } else if (weatherCondition.includes('snow')) {
        circleColor = '#f8fafc'; // White for snow
      }
      
      L.circle([lat, lon], {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.3,
        radius: 20000 // 20km radius
      }).addTo(map);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
      setError('Failed to fetch weather data. Basic map is still available.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-navy">Weather Map</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}
        
        <div className="card">
          <div className="mb-4">
            <p className="text-navy">
              View weather conditions on an interactive map. Click on a location to see detailed weather information.
            </p>
          </div>
          
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
              <span className="ml-2 text-navy">Loading map...</span>
            </div>
          ) : (
            <div className="relative h-96 rounded-md overflow-hidden">
              <div id="map" className="w-full h-full"></div>
              <style jsx>{`
                .temp-icon {
                  background: none;
                  border: none;
                }
              `}</style>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-md shadow border border-taupe">
              <h3 className="text-lg font-medium text-navy mb-2">Map Legend</h3>
              <ul className="space-y-2 text-lavender">
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                  Rain
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-gray-400 rounded-full mr-2"></span>
                  Clouds
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-yellow-400 rounded-full mr-2"></span>
                  Clear
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 bg-white border border-gray-400 rounded-full mr-2"></span>
                  Snow
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow border border-taupe">
              <h3 className="text-lg font-medium text-navy mb-2">Temperature</h3>
              <div className="h-6 w-full bg-gradient-to-r from-blue-600 via-green-500 to-red-600 rounded-md"></div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-lavender">Cold</span>
                <span className="text-xs text-lavender">Hot</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow border border-taupe">
              <h3 className="text-lg font-medium text-navy mb-2">Wind Speed</h3>
              <div className="h-6 w-full bg-gradient-to-r from-green-400 to-blue-600 rounded-md"></div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-lavender">Calm</span>
                <span className="text-xs text-lavender">Strong</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 