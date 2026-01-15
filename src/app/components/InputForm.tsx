'use client';

import { useState } from 'react';

interface InputFormProps {
  onGenerate: (data: {
    appName: string;
    headline?: string;
    valueBullets: string[];
    accentColor?: string;
    deviceFrameStyle: string;
    qualityLevel: string;
    variationsCount: number;
    customInstructions?: string;
  }) => void;
  isGenerating: boolean;
}

export function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [appName, setAppName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bullets, setBullets] = useState(['', '', '']);
  const [accentColor, setAccentColor] = useState('');
  const [deviceFrameStyle, setDeviceFrameStyle] = useState('with sleek bezel');
  const [qualityLevel, setQualityLevel] = useState('high');
  const [variationsCount, setVariationsCount] = useState(3);
  const [customInstructions, setCustomInstructions] = useState('');

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
      headline: headline.trim() || undefined,
      valueBullets: validBullets,
      accentColor: accentColor || undefined,
      deviceFrameStyle,
      qualityLevel,
      variationsCount,
      customInstructions: customInstructions.trim() || undefined,
    });
  };

  const validBullets = bullets.filter((b) => b.trim().length > 0);
  const canSubmit = appName.trim().length > 0;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Step 2
      </p>
      <h2 className="font-display mt-2 text-2xl text-[var(--ink)]">
        Provide app details
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* App Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            App Name *
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g., MyAwesomeApp"
            maxLength={50}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Headline (optional)
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g., Build Momentum, Stay Consistent"
            maxLength={32}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            32 characters max. Leave blank to auto-generate from the UI.
          </p>
        </div>

        {/* Value Bullets */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Value Bullets (optional, shown as overlay points)
          </label>
          <div className="space-y-3">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
                {bullets.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(index)}
                    className="rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
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
              className="mt-3 text-sm font-semibold text-[var(--accent)] transition hover:text-emerald-700"
            >
              + Add another bullet
            </button>
          )}

          <p className="mt-2 text-xs text-[var(--muted)]">
            {validBullets.length}/6 bullets filled
          </p>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Accent Color (optional)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={accentColor || '#0ea5e9'}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#0ea5e9"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        {/* Device Frame Style */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Device Frame Style
          </label>
          <select
            value={deviceFrameStyle}
            onChange={(e) => setDeviceFrameStyle(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="with sleek bezel">With sleek bezel</option>
            <option value="minimal/no bezel">Minimal/no bezel</option>
            <option value="with subtle shadow">With subtle shadow</option>
          </select>
        </div>

        {/* Quality Level */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Quality Level
          </label>
          <select
            value={qualityLevel}
            onChange={(e) => setQualityLevel(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Variations Count */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Variations Count
          </label>
          <select
            value={variationsCount}
            onChange={(e) => setVariationsCount(Number(e.target.value))}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        {/* Custom Instructions */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Custom Instructions (optional)
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="Optional guidance for layout or emphasis."
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isGenerating}
          className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isGenerating ? 'Generating...' : 'Generate Screenshots'}
        </button>
      </form>
    </div>
  );
}
