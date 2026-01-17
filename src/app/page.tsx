'use client';

import { useMemo, useState } from 'react';
import { Bell, User } from 'lucide-react';

import ModernSidebar from './components/ModernSidebar';
import UploadSection from './components/UploadSection';
import CompactSettingsPanel from './components/CompactSettingsPanel';
import EnhancedGenerateButton from './components/EnhancedGenerateButton';
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
      formData.append('qualityLevel', 'auto');
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex">
        <ModernSidebar currentPage="dashboard" />

        <div className="flex-1 flex flex-col lg:ml-0">
          <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
            <div className="h-full px-4 lg:px-8 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">App Store Screenshot Generator</h1>
                <p className="text-xs text-gray-600 mt-0.5">Create stunning marketing screenshots with AI</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-8 pb-24 lg:pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="lg:col-span-2 xl:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xl">📱</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">Upload Screenshots</h2>
                        <p className="text-sm text-gray-600">Add your app screenshots to get started</p>
                      </div>
                    </div>
                    <UploadSection uploadedImages={uploadedImages} onUpload={setUploadedImages} />
                  </div>
                </div>

                <div className="lg:col-span-2 xl:col-span-1 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <CompactSettingsPanel
                      headline={headline}
                      setHeadline={setHeadline}
                      bullets={bullets}
                      setBullets={setBullets}
                      variationsCount={variationsCount}
                      setVariationsCount={setVariationsCount}
                      deviceFrameStyle={deviceFrameStyle}
                      setDeviceFrameStyle={setDeviceFrameStyle}
                      accentColor={accentColor}
                      setAccentColor={setAccentColor}
                      customInstructions={customInstructions}
                      setCustomInstructions={setCustomInstructions}
                    />
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <EnhancedGenerateButton
                      onClick={handleGenerate}
                      disabled={!canGenerate}
                      loadingState={loadingState}
                      progress={progress}
                      errorMessage={errorMessage}
                    />
                    {!canGenerate && (
                      <p className="text-sm text-center text-gray-500 mt-4">
                        Upload at least 1 screenshot to generate
                      </p>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Upload 3-5 screenshots for best results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Use benefits-focused bullets, not features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Leave headline empty for AI generation</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
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
