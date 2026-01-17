'use client';

import React, { useState } from 'react';

interface InputFormProps {
  headline: string;
  setHeadline: (value: string) => void;
  bullets: string;
  setBullets: (value: string) => void;
  variationsCount: number;
  setVariationsCount: (value: number) => void;
  deviceFrameStyle: string;
  setDeviceFrameStyle: (value: string) => void;
  qualityLevel: string;
  setQualityLevel: (value: string) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
}

export default function InputForm({
  headline,
  setHeadline,
  bullets,
  setBullets,
  variationsCount,
  setVariationsCount,
  deviceFrameStyle,
  setDeviceFrameStyle,
  qualityLevel,
  setQualityLevel,
  accentColor,
  setAccentColor,
  customInstructions,
  setCustomInstructions,
}: InputFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [headlineWarning, setHeadlineWarning] = useState('');

  // Apple-restricted keywords
  const restrictedWords = ['best', 'number one', '#1', 'top', 'winner', 'award-winning'];

  const validateHeadline = (text: string) => {
    const lowerText = text.toLowerCase();
    const found = restrictedWords.find(word => lowerText.includes(word));
    if (found) {
      setHeadlineWarning(`⚠️ Avoid "${found}" - may violate App Store guidelines`);
    } else {
      setHeadlineWarning('');
    }
  };

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHeadline(value);
    validateHeadline(value);
  };

  const characterCount = headline.length;
  const maxChars = 50;

  return (
    <div className="space-y-6">
      {/* Essential Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Marketing Copy</h2>
        
        {/* Headline */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline
            <span className="text-gray-400 ml-2 text-xs">Optional - AI will generate if empty</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={handleHeadlineChange}
            placeholder="e.g., Track Your Fitness Journey"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            maxLength={maxChars}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs">
              {headlineWarning && (
                <span className="text-amber-600">{headlineWarning}</span>
              )}
            </div>
            <span className={`text-xs ${characterCount > maxChars - 10 ? 'text-amber-600' : 'text-gray-500'}`}>
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Bullet Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Bullets
            <span className="text-gray-400 ml-2 text-xs">Optional - one per line</span>
          </label>
          <textarea
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
            placeholder="Real-time workout tracking&#10;Personalized meal plans&#10;Progress analytics"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <p className="mt-2 text-xs text-gray-500">
            💡 Tip: Focus on user benefits, not features
          </p>
        </div>
      </div>

      {/* Quick Style Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Style</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Variations Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variations per Screenshot
            </label>
            <select
              value={variationsCount}
              onChange={(e) => setVariationsCount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 (Fast)</option>
              <option value={2}>2</option>
              <option value={3}>3 (Recommended)</option>
              <option value={4}>4</option>
              <option value={5}>5 (Maximum)</option>
            </select>
          </div>

          {/* Device Frame Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Frame
            </label>
            <select
              value={deviceFrameStyle}
              onChange={(e) => setDeviceFrameStyle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sleek bezel">Sleek Bezel (Modern)</option>
              <option value="minimal">Minimal</option>
              <option value="subtle shadow">Subtle Shadow</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Options (Collapsible) */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg"
        >
          <span className="text-lg font-semibold">Advanced Options</span>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
            {/* Quality Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generation Quality
                <span className="text-gray-400 ml-2 text-xs">Affects cost</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {(['low', 'medium', 'high', 'auto'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setQualityLevel(quality)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      qualityLevel === quality
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
                <span className="text-gray-400 ml-2 text-xs">Optional override</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Instructions
                <span className="text-gray-400 ml-2 text-xs">Extra guidance for AI</span>
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Emphasize the workout tracking feature, use energetic colors"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cost Estimate */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Estimated Cost</p>
            <p className="text-xs text-blue-700 mt-1">
              {variationsCount} variation(s) × {qualityLevel} quality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
