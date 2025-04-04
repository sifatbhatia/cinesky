'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      router.push('/home');
    } catch (err) {
      setError('Failed to create an account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand to-taupe">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg border border-mauve">
        <h1 className="text-center mb-6 text-navy">Join CineSky</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-navy">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-lavender rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mauve focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-lavender rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mauve focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-lavender rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mauve focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-lavender rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mauve focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-mauve hover:bg-lavender text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-navy">
            Already have an account?{' '}
            <Link href="/login" className="text-mauve hover:text-lavender">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 