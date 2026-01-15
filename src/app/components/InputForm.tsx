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

        {/* Value Bullets */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
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

        {/* Brand Color */}
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-2">
            Brand Color (optional)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={brandColor || '#0ea5e9'}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-20 cursor-pointer rounded-lg border border-[var(--border)]"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              placeholder="#0ea5e9"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--ink)] shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isGenerating}
          className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isGenerating ? 'Generating...' : 'Generate Storyboard'}
        </button>
      </form>
    </div>
  );
}
