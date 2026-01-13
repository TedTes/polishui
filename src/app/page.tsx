'use client';

import { useState } from 'react';
import {StoryboardPreview,InputForm,UploadSection} from "./components";
export default function Home() {
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [storyboard, setStoryboard] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const handleGenerate = async (data: {
    appName: string;
    valueBullets: string[];
    brandColor?: string;
  }) => {
    setIsGenerating(true);
    setError(null);
    setWarnings([]);

    try {
      const formData = new FormData();
      formData.append('appName', data.appName);
      formData.append('valueBullets', JSON.stringify(data.valueBullets));
      
      if (data.brandColor) {
        formData.append('brandColor', data.brandColor);
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
        throw new Error(errorData.error || 'Failed to generate storyboard');
      }

      const result = await response.json();
      setStoryboard(result.storyboard);
      setWarnings(result.warnings || []);
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
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            App Store Screenshot Generator
          </h1>
          <p className="text-gray-600">
            Generate professional App Store screenshots in seconds
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Warnings Display */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="font-medium text-yellow-900 mb-2">Warnings:</p>
            <ul className="list-disc list-inside text-yellow-800 text-sm">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {!storyboard ? (
          /* Input Phase */
          <div className="space-y-8">
            <UploadSection
              screenshots={screenshots}
              onScreenshotsChange={setScreenshots}
            />

            {screenshots.length >= 5 && (
              <InputForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
          </div>
        ) : (
          /* Preview & Export Phase */
          <div className="space-y-6">
            <StoryboardPreview
              storyboard={storyboard}
              screenshots={screenshots}
            />

            <div className="flex gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? 'Exporting...' : 'Export ZIP'}
              </button>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
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