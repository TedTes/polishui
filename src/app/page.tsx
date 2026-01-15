'use client';

import { useCallback, useState } from 'react';
import { StoryboardPreview, InputForm, UploadSection } from './components';

export default function Home() {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [storyboard, setStoryboard] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Fixed: Use useCallback without dependencies, ensuring functional update
  const handleAddScreenshots = useCallback((files: File[]) => {
    console.log('🔵 handleAddScreenshots called with:', files.length, 'new files');
    
    setScreenshots((prev) => {
      
      const combined = [...prev, ...files];
      
      const result = combined.slice(0, 10);
      
      return result;
    });
  }, []);
  
  const handleScreenshotsChange = useCallback((files: File[]) => {
    setScreenshots(files);
  }, []);

  const handleGenerate = async (data: {
    appName: string;
    headline?: string;
    valueBullets: string[];
    accentColor?: string;
    deviceFrameStyle: string;
    qualityLevel: string;
    variationsCount: number;
    customInstructions?: string;
  }) => {
    setIsGenerating(true);
    setError(null);
    setWarnings([]);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('appName', data.appName);
      formData.append('valueBullets', JSON.stringify(data.valueBullets));
      if (data.headline) {
        formData.append('headline', data.headline);
      }
      if (data.accentColor) {
        formData.append('accentColor', data.accentColor);
      }
      formData.append('deviceFrameStyle', data.deviceFrameStyle);
      formData.append('qualityLevel', data.qualityLevel);
      formData.append('variationsCount', String(data.variationsCount));
      if (data.customInstructions) {
        formData.append('customInstructions', data.customInstructions);
      }

      screenshots.forEach((file) => {
        formData.append('screenshots', file);
      });

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate screenshots');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = data.appName
        ? data.appName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : 'app-store';
      a.download = `${safeName}_promotional_screenshots.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessMessage('Your promotional screenshots are ready.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!storyboard) return;

    setIsExporting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('storyboard', JSON.stringify(storyboard));

      screenshots.forEach((file) => {
        formData.append('screenshots', file);
      });

      const response = await fetch('/api/export', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${storyboard.appName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_screenshots.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setStoryboard(null);
    setScreenshots([]);
    setError(null);
    setWarnings([]);
    setSuccessMessage(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-200 via-emerald-100 to-transparent blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-[-140px] left-[-5%] h-[380px] w-[380px] rounded-full bg-gradient-to-br from-amber-200 via-orange-100 to-transparent blur-3xl opacity-70" />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            GPT-4o-mini powered copy
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
            App Store screenshots that look premium and convert
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
            Upload your best product shots, add a few benefits, and export a polished
            App Store package in minutes.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-red-900">Something went wrong</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Warnings Display */}
        {warnings.length > 0 && (
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-amber-900">Heads up</p>
            <ul className="mt-2 list-disc list-inside text-sm text-amber-800">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-emerald-900">{successMessage}</p>
          </div>
        )}

        {!storyboard ? (
          /* Input Phase */
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              <UploadSection
                screenshots={screenshots}
                onAddScreenshots={handleAddScreenshots}
                onScreenshotsChange={handleScreenshotsChange}
              />

            {screenshots.length >= 1 && (
              <InputForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  What you get
                </p>
                <h3 className="font-display mt-3 text-2xl text-[var(--ink)]">
                  A ready-to-upload App Store package
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  <li>10 screenshots sized for iPhone and iPad</li>
                  <li>Deterministic naming for quick uploads</li>
                  <li>Manifest with templates, copy, and metadata</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-2)]">
                  Workflow
                </p>
                <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--accent)]">
                      1
                    </span>
                    Upload 5-10 screenshots to analyze.
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--accent)]">
                      2
                    </span>
                    Add your app name and top benefits.
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--accent)]">
                      3
                    </span>
                    Preview slides, then export your ZIP.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Preview & Export Phase */
          <div className="space-y-6">
            <StoryboardPreview
              storyboard={storyboard}
              screenshots={screenshots}
            />

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {isExporting ? 'Exporting...' : 'Export ZIP'}
              </button>

              <button
                onClick={handleReset}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--ink)] shadow-sm transition hover:-translate-y-0.5"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
