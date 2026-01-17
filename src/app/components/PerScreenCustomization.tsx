'use client';

import React, { useState } from 'react';

interface ScreenSettings {
  headline: string;
  bullets: string;
  customInstructions: string;
}

interface PerScreenCustomizationProps {
  uploadedImages: File[];
  globalSettings: ScreenSettings;
  perScreenSettings: Map<number, ScreenSettings>;
  onUpdateScreenSettings: (index: number, settings: ScreenSettings | null) => void;
  isGlobalMode: boolean;
  onToggleMode: () => void;
}

export default function PerScreenCustomization({
  uploadedImages,
  globalSettings,
  perScreenSettings,
  onUpdateScreenSettings,
  isGlobalMode,
  onToggleMode
}: PerScreenCustomizationProps) {
  const [selectedScreen, setSelectedScreen] = useState<number>(0);
  
  const currentSettings = isGlobalMode 
    ? globalSettings 
    : perScreenSettings.get(selectedScreen) || globalSettings;

  const hasCustomSettings = (index: number) => perScreenSettings.has(index);

  const handleSettingChange = (field: keyof ScreenSettings, value: string) => {
    if (isGlobalMode) return; // Don't update in global mode
    
    const newSettings = {
      ...currentSettings,
      [field]: value
    };
    onUpdateScreenSettings(selectedScreen, newSettings);
  };

  const handleResetScreen = () => {
    if (window.confirm('Reset this screenshot to global settings?')) {
      onUpdateScreenSettings(selectedScreen, null);
    }
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Customization Mode</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isGlobalMode ? 'Settings apply to all screenshots' : 'Customize each screenshot individually'}
          </p>
        </div>
        <button
          onClick={onToggleMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isGlobalMode ? 'bg-gray-300' : 'bg-blue-600'
          }`}
        >
          <span className="sr-only">Toggle customization mode</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isGlobalMode ? 'translate-x-1' : 'translate-x-6'
            }`}
          />
        </button>
      </div>

      {/* Per-Screen Interface (only show when not in global mode) */}
      {!isGlobalMode && (
        <>
          {/* Screenshot Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Screenshot to Customize
            </label>
            <div className="grid grid-cols-5 gap-3">
              {uploadedImages.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedScreen(index)}
                  className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 transition-all ${
                    selectedScreen === index
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Custom badge */}
                  {hasCustomSettings(index) && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Custom
                    </div>
                  )}
                  
                  {/* Index */}
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Settings Form */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Screenshot {selectedScreen + 1} Settings
              </h3>
              {hasCustomSettings(selectedScreen) && (
                <button
                  onClick={handleResetScreen}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Reset to Global
                </button>
              )}
            </div>

            {/* Headline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Headline
                <span className="text-gray-400 ml-2 text-xs">
                  {hasCustomSettings(selectedScreen) ? 'Custom' : 'Using global'}
                </span>
              </label>
              <input
                type="text"
                value={currentSettings.headline}
                onChange={(e) => handleSettingChange('headline', e.target.value)}
                placeholder="Leave empty to use global headline"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Bullets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Bullets
                <span className="text-gray-400 ml-2 text-xs">
                  {hasCustomSettings(selectedScreen) ? 'Custom' : 'Using global'}
                </span>
              </label>
              <textarea
                value={currentSettings.bullets}
                onChange={(e) => handleSettingChange('bullets', e.target.value)}
                placeholder="Leave empty to use global bullets"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screen-Specific Instructions
                <span className="text-gray-400 ml-2 text-xs">Optional</span>
              </label>
              <textarea
                value={currentSettings.customInstructions}
                onChange={(e) => handleSettingChange('customInstructions', e.target.value)}
                placeholder="e.g., Focus on the login screen, emphasize security features"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Tip:</strong> Custom settings override global settings for this screenshot only. 
                Empty fields will use global values.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Global Mode Info */}
      {isGlobalMode && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Global Mode Active</p>
              <p className="text-xs text-gray-600 mt-1">
                All screenshots will use the same settings. Toggle the switch above to customize individual screenshots.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}