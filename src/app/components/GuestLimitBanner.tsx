'use client';

import React, { useState, useEffect } from 'react';

const DAILY_LIMIT = 3;

interface GuestLimitBannerProps {
  onSignUpClick: () => void;
}

export default function GuestLimitBanner({ onSignUpClick }: GuestLimitBannerProps) {
  const [generationsToday, setGenerationsToday] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load today's generation count from localStorage
    const today = new Date().toDateString();
    const stored = localStorage.getItem('generationData');
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setGenerationsToday(data.count);
      } else {
        // New day, reset count
        localStorage.setItem('generationData', JSON.stringify({ date: today, count: 0 }));
        setGenerationsToday(0);
      }
    } else {
      localStorage.setItem('generationData', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const remaining = Math.max(0, DAILY_LIMIT - generationsToday);
  const isLimitReached = remaining === 0;

  if (!isVisible) return null;

  return (
    <div className={`rounded-lg border p-4 mb-6 ${
      isLimitReached 
        ? 'bg-red-50 border-red-200' 
        : remaining === 1 
        ? 'bg-amber-50 border-amber-200'
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${
            isLimitReached 
              ? 'bg-red-100' 
              : remaining === 1 
              ? 'bg-amber-100'
              : 'bg-blue-100'
          }`}>
            {isLimitReached ? (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold text-sm ${
              isLimitReached ? 'text-red-900' : 'text-gray-900'
            }`}>
              {isLimitReached 
                ? 'Daily Limit Reached' 
                : `${remaining} Generation${remaining !== 1 ? 's' : ''} Remaining Today`
              }
            </h3>
            <p className={`text-xs mt-1 ${
              isLimitReached ? 'text-red-700' : 'text-gray-600'
            }`}>
              {isLimitReached 
                ? 'Sign up for unlimited generations and save your work'
                : 'Free users get 3 generations per day. Sign up for unlimited access!'
              }
            </p>
            
            <button
              onClick={onSignUpClick}
              className={`mt-3 text-sm font-medium underline ${
                isLimitReached 
                  ? 'text-red-700 hover:text-red-800'
                  : 'text-blue-700 hover:text-blue-800'
              }`}
            >
              Sign Up for Free →
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {!isLimitReached && (
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              remaining === 1 ? 'bg-amber-500' : 'bg-blue-600'
            }`}
            style={{ width: `${(generationsToday / DAILY_LIMIT) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Helper function to increment generation count
export function incrementGenerationCount() {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('generationData');
  
  if (stored) {
    const data = JSON.parse(stored);
    if (data.date === today) {
      data.count += 1;
      localStorage.setItem('generationData', JSON.stringify(data));
    } else {
      // New day
      localStorage.setItem('generationData', JSON.stringify({ date: today, count: 1 }));
    }
  }
}

// Helper function to check if limit reached
export function isLimitReached(): boolean {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('generationData');
  
  if (stored) {
    const data = JSON.parse(stored);
    if (data.date === today) {
      return data.count >= DAILY_LIMIT;
    }
  }
  return false;
}