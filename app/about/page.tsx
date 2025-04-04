'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

export default function About() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-taupe">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-navy">About CineSky</h1>
        
        <div className="card max-w-3xl mx-auto">
          <h2 className="mb-4 text-navy">For Filmmakers, By Filmmakers</h2>
          <p className="mb-6 text-navy">
            CineSky is a specialized weather application tailored specifically for cinematographers and filmmakers.
            When it comes to weather, most people just need basic information, but filmmakers require detailed 
            atmospheric conditions to plan and execute their perfect shots.
          </p>
          
          <h2 className="mb-4 text-navy">Our Mission</h2>
          <p className="mb-6 text-navy">
            Our mission is to provide filmmakers with detailed, accurate weather information that's relevant to 
            cinematography in a clean, user-friendly interface. We understand that the perfect shot depends on 
            the perfect conditions, and we're here to help you find those moments.
          </p>
          
          <h2 className="mb-4 text-navy">Key Features</h2>
          <ul className="list-disc pl-5 mb-6 text-navy space-y-2">
            <li>Detailed weather data tailored for filmmakers</li>
            <li>Golden hour tracking and notifications</li>
            <li>Precise sunrise and sunset times</li>
            <li>Light quality metrics and forecasts</li>
            <li>Visibility and atmospheric conditions</li>
            <li>Timeline slider for time-specific forecasts</li>
            <li>UV index and sun luminance data</li>
            <li>Interactive maps for location scouting</li>
            <li>Shooting condition recommendations</li>
          </ul>
          
          <h2 className="mb-4 text-navy">Our Audience</h2>
          <p className="mb-6 text-navy">
            CineSky was built for:
          </p>
          <ul className="list-disc pl-5 mb-6 text-navy space-y-2">
            <li>Professional cinematographers and filmmakers</li>
            <li>Film students and aspiring directors</li>
            <li>Photographers seeking optimal lighting conditions</li>
            <li>Production crews planning outdoor shoots</li>
            <li>Anyone who appreciates detailed weather information for visual media creation</li>
          </ul>
          
          <h2 className="mb-4 text-navy">Technology</h2>
          <p className="mb-4 text-navy">
            CineSky is built using modern web technologies:
          </p>
          <ul className="list-disc pl-5 mb-6 text-navy space-y-2">
            <li>Next.js - React framework for building the user interface</li>
            <li>TypeScript - For type-safe code</li>
            <li>Tailwind CSS - For styling and responsive design</li>
            <li>Firebase - For user authentication and data storage</li>
            <li>OpenWeatherMap API - For comprehensive weather data</li>
          </ul>
          
          <div className="bg-lavender/10 p-6 rounded-md border border-lavender">
            <h2 className="text-xl font-semibold mb-2 text-navy">Contact Information</h2>
            <p className="text-navy">
              For support, feedback, or inquiries, please visit our <a href="/contact" className="text-mauve hover:text-lavender underline">Contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 