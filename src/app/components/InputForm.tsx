'use client';

import { useState } from 'react';

interface InputFormProps {
  onGenerate: (data: {
    appName: string;
    valueBullets: string[];
    brandColor?: string;
  }) => void;
  isGenerating: boolean;
}

export function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [appName, setAppName] = useState('');
  const [bullets, setBullets] = useState(['', '', '']);
  const [brandColor, setBrandColor] = useState('');

  const handleBulletChange = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    setBullets(updated);
  };

  const handleAddBullet = () => {
    if (bullets.length < 6) {
      setBullets([...bullets, '']);
    }
  };

  const handleRemoveBullet = (index: number) => {
    if (bullets.length > 3) {
      setBullets(bullets.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validBullets = bullets.filter((b) => b.trim().length > 0);
    
    if (!appName.trim() || validBullets.length < 3) {
      return;
    }

    onGenerate({
      appName: appName.trim(),
      valueBullets: validBullets,
      brandColor: brandColor || undefined,
    });
  };

  const validBullets = bullets.filter((b) => b.trim().length > 0);
  const canSubmit = appName.trim().length > 0 && validBullets.length >= 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        2. Provide App Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* App Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Name *
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g., MyAwesomeApp"
            maxLength={50}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Value Bullets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value Bullets * (3-6 required)
          </label>
          <div className="space-y-3">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {bullets.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {bullets.length < 6 && (
            <button
              type="button"
              onClick={handleAddBullet}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              + Add another bullet
            </button>
          )}

          <p className="mt-2 text-sm text-gray-500">
            {validBullets.length}/6 bullets filled
          </p>
        </div>

        {/* Brand Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Color (optional)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={brandColor || '#0ea5e9'}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="#0ea5e9"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isGenerating}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Storyboard'}
        </button>
      </form>
    </div>
  );
}