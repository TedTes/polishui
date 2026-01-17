'use client';

import React, { useState } from 'react';

interface AISuggestionProps {
  uploadedImages: File[];
  onApplySuggestion: (headline: string, bullets: string) => void;
}

export default function AISuggestion({ uploadedImages, onApplySuggestion }: AISuggestionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ headline: string; bullets: string } | null>(null);
  const [error, setError] = useState<string>('');

  const generateSuggestions = async () => {
    if (uploadedImages.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      // Use first screenshot for analysis
      const formData = new FormData();
      formData.append('screenshot', uploadedImages[0]);

      const response = await fetch('/api/suggest-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      setSuggestions({
        headline: data.headline,
        bullets: data.bullets
      });

    } catch (err) {
      console.error('AI suggestion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions) {
      onApplySuggestion(suggestions.headline, suggestions.bullets);
      setSuggestions(null);
    }
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Text Suggestion</h3>
            <p className="text-sm text-gray-600 mt-1">
              Let AI analyze your screenshot and suggest compliant marketing copy
            </p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      {!suggestions && !error && (
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing screenshot...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Suggestions
            </span>
          )}
        </button>
      )}

      {/* Suggestions Display */}
      {suggestions && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested Headline
            </label>
            <p className="text-gray-900 font-medium">{suggestions.headline}</p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggested Bullets
            </label>
            <div className="text-gray-900 whitespace-pre-line">{suggestions.bullets}</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Apply Suggestions
            </button>
            <button
              onClick={() => setSuggestions(null)}
              className="flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>

          <p className="text-xs text-gray-600 text-center">
            💡 These are suggestions - feel free to edit them in the form above
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Failed to generate suggestions</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={generateSuggestions}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}