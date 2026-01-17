'use client';

import { useMemo, useState } from 'react';

import { OnboardingOverlay, InputForm, UploadSection } from './components';
import { incrementGenerationCount, isLimitReached } from './components/GuestLimitBanner';
import { ToastProvider, useToast } from './components/ToastProvider';

type LoadingState = 'idle' | 'generating' | 'success' | 'error';

function HomeContent() {
  const { showToast } = useToast();

  // Upload state
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Form state
  const [headline, setHeadline] = useState('');
  const [bullets, setBullets] = useState('');
  const [variationsCount, setVariationsCount] = useState(3);
  const [deviceFrameStyle, setDeviceFrameStyle] = useState('sleek bezel');
  const [qualityLevel, setQualityLevel] = useState('high');
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [customInstructions, setCustomInstructions] = useState('');

  // Generation state
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState('');

  const canGenerate = uploadedImages.length > 0 && loadingState === 'idle' && !isLimitReached();
  const bulletList = useMemo(
    () =>
      bullets
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 4),
    [bullets]
  );

  const handleGenerate = async () => {
    if (!canGenerate) {
      if (isLimitReached()) {
        showToast('Daily limit reached. Sign up for unlimited generations!', 'warning');
      }
      return;
    }

    setLoadingState('generating');
    setProgress({ current: 0, total: uploadedImages.length });
    setErrorMessage('');

    try {
      const formData = new FormData();
      
      // Append all uploaded images
      uploadedImages.forEach((file) => {
        formData.append('screenshots', file);
      });

      // Append generation parameters
      formData.append('headline', headline);
      formData.append('valueBullets', JSON.stringify(bulletList));
      formData.append('variationsCount', variationsCount.toString());
      formData.append('deviceFrameStyle', deviceFrameStyle);
      formData.append('qualityLevel', qualityLevel);
      formData.append('accentColor', accentColor);
      formData.append('customInstructions', customInstructions);

      // Track progress
      const progressInterval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          current: Math.min(prev.current + 1, prev.total - 1)
        }));
      }, 2000);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(prev => ({ ...prev, current: prev.total }));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Generation failed' }));
        throw new Error(errorData.error || 'Failed to generate screenshots');
      }

      // Download the ZIP file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `app-screenshots-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setLoadingState('success');
      incrementGenerationCount();
      showToast('Screenshots generated successfully!', 'success');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setLoadingState((prev) => (prev === 'success' ? 'idle' : prev));
      }, 3000);

    } catch (error) {
      console.error('Generation error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(message);
      setLoadingState('error');
      showToast(message, 'error');
    }
  };

  const handleRetry = () => {
    setLoadingState('idle');
    setErrorMessage('');
    handleGenerate();
  };

  const handleSignUpClick = () => {
    showToast('Sign up feature coming soon!', 'info');
    // In production: navigate to sign up page or show modal
  };

  return (
    <>
      <OnboardingOverlay onComplete={() => {}} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  polishui
                </h1>
                <p className="mt-2 text-gray-600">
                  Transform your app screenshots with AI-powered marketing overlays
                </p>
              </div>
              <button
                onClick={handleSignUpClick}
                className="hidden md:block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.2fr_1fr]">
            {/* Left Menu */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Menu
              </p>
              <nav className="mt-4 space-y-2 text-sm font-medium text-gray-700">
                <button className="flex w-full items-center justify-between rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                  Dashboard
                  <span className="text-xs font-semibold">Current</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50">
                  Projects
                  <span className="text-xs text-gray-400">Soon</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50">
                  Templates
                  <span className="text-xs text-gray-400">Soon</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-50">
                  Billing
                  <span className="text-xs text-gray-400">Soon</span>
                </button>
              </nav>
            </section>

            {/* Middle Upload */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <UploadSection
                uploadedImages={uploadedImages}
                onUpload={setUploadedImages}
              />
            </section>

            {/* Right Settings */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <p className="mt-1 text-sm text-gray-600">
                Define the copy and styling for your promotional screenshots.
              </p>
              <div className="mt-6">
                <InputForm
                  headline={headline}
                  setHeadline={setHeadline}
                  bullets={bullets}
                  setBullets={setBullets}
                  variationsCount={variationsCount}
                  setVariationsCount={setVariationsCount}
                  deviceFrameStyle={deviceFrameStyle}
                  setDeviceFrameStyle={setDeviceFrameStyle}
                  qualityLevel={qualityLevel}
                  setQualityLevel={setQualityLevel}
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  customInstructions={customInstructions}
                  setCustomInstructions={setCustomInstructions}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={`
                  mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all shadow-lg
                  ${canGenerate
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {loadingState === 'generating' ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating... ({progress.current}/{progress.total})
                  </span>
                ) : loadingState === 'success' ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Download Complete!
                  </span>
                ) : (
                  `Generate ${uploadedImages.length * variationsCount} Screenshot${uploadedImages.length * variationsCount > 1 ? 's' : ''}`
                )}
              </button>

              {/* Error Message */}
              {loadingState === 'error' && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">Generation Failed</p>
                      <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
                      <button
                        onClick={handleRetry}
                        className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {loadingState === 'generating' && (
                <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Processing screenshot {progress.current} of {progress.total}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round((progress.current / progress.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
            Powered by OpenAI DALL-E • Apple App Store Guidelines Compliant
          </div>
        </footer>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}
