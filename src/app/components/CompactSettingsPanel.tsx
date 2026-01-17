'use client';

import React, { useState } from 'react';
import { 
  Settings2, 
  Palette, 
  Type, 
  Layers, 
  Zap,
  ChevronDown,
  Info
} from 'lucide-react';

interface CompactSettingsPanelProps {
  headline: string;
  setHeadline: (value: string) => void;
  bullets: string;
  setBullets: (value: string) => void;
  variationsCount: number;
  setVariationsCount: (value: number) => void;
  deviceFrameStyle: string;
  setDeviceFrameStyle: (value: string) => void;
  accentColor: string;
  setAccentColor: (value: string) => void;
  customInstructions: string;
  setCustomInstructions: (value: string) => void;
}

export default function CompactSettingsPanel({
  headline,
  setHeadline,
  bullets,
  setBullets,
  variationsCount,
  setVariationsCount,
  deviceFrameStyle,
  setDeviceFrameStyle,
  accentColor,
  setAccentColor,
  customInstructions,
  setCustomInstructions,
}: CompactSettingsPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('content');
  
  const maxChars = 120;
  const characterCount = headline.length;
  const bulletLines = bullets.split('\n').filter(line => line.trim());

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        </button>
        
        {isExpanded && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4 animate-slideDown">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-900">Generator Settings</h2>
      </div>

      {/* Content Section */}
      <Section id="content" title="Content" icon={Type}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline
            <span className="text-gray-400 ml-2 text-xs">Optional</span>
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Track Your Fitness Journey"
            maxLength={maxChars}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-gray-500">Leave empty for AI generation</p>
            <span className={`text-xs font-medium ${
              characterCount > maxChars * 0.9 ? 'text-amber-600' : 'text-gray-500'
            }`}>
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Bullets
            <span className="text-gray-400 ml-2 text-xs">
              {bulletLines.length} bullet{bulletLines.length !== 1 ? 's' : ''}
            </span>
          </label>
          <textarea
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
            placeholder="Real-time workout tracking&#10;Personalized meal plans&#10;Progress analytics"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
          />
          <div className="flex items-start gap-2 mt-1.5 text-xs text-gray-500">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>One benefit per line • Focus on user outcomes</span>
          </div>
        </div>
      </Section>

      {/* Style Section */}
      <Section id="style" title="Style" icon={Palette}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variations
            </label>
            <select
              value={variationsCount}
              onChange={(e) => setVariationsCount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value={1}>1 Fast</option>
              <option value={2}>2 Good</option>
              <option value={3}>3 Best</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Style
            </label>
            <select
              value={deviceFrameStyle}
              onChange={(e) => setDeviceFrameStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="sleek bezel">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="subtle shadow">Shadow</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#3B82F6"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            />
          </div>
        </div>
      </Section>

      {/* Advanced Section */}
      <Section id="advanced" title="Advanced" icon={Zap}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions
            <span className="text-gray-400 ml-2 text-xs">Optional</span>
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g., Focus on the calendar feature, use warm colors..."
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Specific guidance for the AI generator
          </p>
        </div>
      </Section>

      {/* Quick Stats Card */}
      <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Generation Preview</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-600">Output</span>
            <p className="font-semibold text-gray-900 mt-0.5">
              {variationsCount}x variations
            </p>
          </div>
          <div>
            <span className="text-gray-600">Style</span>
            <p className="font-semibold text-gray-900 mt-0.5 capitalize">
              {deviceFrameStyle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}