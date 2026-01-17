'use client';

import React from 'react';

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: {
    headline?: string;
    bullets?: string;
    variationsCount?: number;
    deviceFrameStyle?: string;
    accentColor?: string;
  };
}

const presets: Preset[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple overlays with subtle accents',
    icon: '◻️',
    settings: {
      variationsCount: 2,
      deviceFrameStyle: 'minimal',
      accentColor: '#000000',
    }
  },
  {
    id: 'feature-focused',
    name: 'Feature-Focused',
    description: 'Highlight key features with bold text',
    icon: '⚡',
    settings: {
      variationsCount: 3,
      deviceFrameStyle: 'sleek bezel',
      accentColor: '#3B82F6',
    }
  },
  {
    id: 'benefit-style',
    name: 'Benefit-Style',
    description: 'Emphasize user benefits and outcomes',
    icon: '🎯',
    settings: {
      variationsCount: 3,
      deviceFrameStyle: 'subtle shadow',
      accentColor: '#10B981',
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Elegant design for high-end apps',
    icon: '✨',
    settings: {
      variationsCount: 4,
      deviceFrameStyle: 'sleek bezel',
      accentColor: '#8B5CF6',
    }
  }
];

interface PresetSelectorProps {
  onSelect: (preset: Preset) => void;
  currentPreset?: string;
}

export default function PresetSelector({ onSelect, currentPreset }: PresetSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Quick Presets</h2>
          <p className="text-sm text-gray-600 mt-1">Apply professional templates instantly</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 ${isExpanded ? '' : 'hidden md:grid'}`}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              currentPreset === preset.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">{preset.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{preset.name}</h3>
            <p className="text-xs text-gray-600 line-clamp-2">{preset.description}</p>
            
            {currentPreset === preset.id && (
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Active
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}