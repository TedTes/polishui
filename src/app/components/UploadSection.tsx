'use client';

import { useCallback } from 'react';

interface UploadSectionProps {
  screenshots: File[];
  onScreenshotsChange: (files: File[]) => void;
}

export function UploadSection({ screenshots, onScreenshotsChange }: UploadSectionProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      onScreenshotsChange(imageFiles.slice(0, 10)); // Max 10
    },
    [onScreenshotsChange]
  );

  const handleRemoveScreenshot = (index: number) => {
    const updated = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        1. Upload Screenshots
      </h2>

      <p className="text-gray-600 mb-4">
        Upload 5-10 in-app screenshots (PNG or JPG)
      </p>

      <div className="mb-4">
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      {screenshots.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded: {screenshots.length}/10
          </p>
          <div className="grid grid-cols-5 gap-4">
            {screenshots.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-200"
                />
                <button
                  onClick={() => handleRemoveScreenshot(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screenshots.length < 5 && screenshots.length > 0 && (
        <p className="mt-4 text-sm text-yellow-700">
          Please upload at least 5 screenshots (you have {screenshots.length})
        </p>
      )}
    </div>
  );
}