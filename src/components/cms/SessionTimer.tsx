'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SessionTimerProps {
  onSessionExpired?: () => void;
}

export default function SessionTimer({ onSessionExpired }: SessionTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
  const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before expiry

  useEffect(() => {
    let sessionTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const resetSession = () => {
      // Clear existing timers
      if (sessionTimer) clearTimeout(sessionTimer);
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownInterval) clearInterval(countdownInterval);

      // Set warning timer (8 minutes)
      warningTimer = setTimeout(() => {
        setTimeLeft(120); // 2 minutes in seconds
        toast('⏰ Session will expire in 2 minutes', {
          duration: 5000,
          icon: '⚠️',
        });

        // Start countdown
        countdownInterval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev === null || prev <= 1) {
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, SESSION_DURATION - WARNING_TIME);

      // Set session expiry timer (10 minutes)
      sessionTimer = setTimeout(() => {
        clearInterval(countdownInterval);
        setTimeLeft(null);
        toast.error('Session expired. Please login again.');
        
        // Clear auth token
        document.cookie = 'auth_token=; path=/; max-age=0';
        localStorage.removeItem('auth_token');
        
        if (onSessionExpired) {
          onSessionExpired();
        } else {
          router.push('/cms/login');
        }
      }, SESSION_DURATION);
    };

    // Reset session on user activity
    const handleUserActivity = () => {
      // Only reset if user is still authenticated
      fetch('/api/auth/me')
        .then(res => {
          if (res.ok) {
            resetSession();
          }
        })
        .catch(() => {
          // Ignore errors
        });
    };

    // Listen to user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Initialize session timer
    resetSession();

    // Cleanup
    return () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      if (warningTimer) clearTimeout(warningTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [router, onSessionExpired]);

  // Display countdown when time is running out
  if (timeLeft !== null && timeLeft > 0) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="fixed bottom-4 right-4 z-50 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4 max-w-sm animate-pulse">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your session will expire in{' '}
              <span className="font-bold">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Move your mouse or press any key to stay logged in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
