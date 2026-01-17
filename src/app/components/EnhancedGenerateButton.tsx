'use client';

import React from 'react';
import { Sparkles, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EnhancedGenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loadingState: 'idle' | 'generating' | 'success' | 'error';
  progress?: { current: number; total: number };
  errorMessage?: string;
}

export default function EnhancedGenerateButton({
  onClick,
  disabled,
  loadingState,
  progress,
  errorMessage,
}: EnhancedGenerateButtonProps) {
  const getButtonContent = () => {
    switch (loadingState) {
      case 'generating':
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>
              Generating {progress ? `${progress.current}/${progress.total}` : '...'}
            </span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Success! Downloaded</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>Failed - Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Screenshots</span>
          </>
        );
    }
  };

  const getButtonStyles = () => {
    if (disabled && loadingState === 'idle') {
      return 'bg-gray-200 text-gray-400 cursor-not-allowed';
    }

    switch (loadingState) {
      case 'generating':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-wait';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]';
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={onClick}
        disabled={disabled && loadingState === 'idle'}
        className={`
          w-full px-6 py-4 rounded-xl font-semibold text-sm
          flex items-center justify-center gap-3
          transition-all duration-300 shadow-lg
          ${getButtonStyles()}
        `}
      >
        {getButtonContent()}
      </button>

      {loadingState === 'generating' && progress && (
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-600">
            Processing screenshot {progress.current} of {progress.total}
          </p>
        </div>
      )}

      {loadingState === 'error' && errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {loadingState === 'success' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Download className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-800">
            Screenshots downloaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
