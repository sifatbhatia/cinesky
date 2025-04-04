'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
    </div>
  );
} 