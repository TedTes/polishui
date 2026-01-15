'use client';

import { useCallback, useEffect, useMemo } from 'react';

interface UploadSectionProps {
  screenshots: File[];
  onAddScreenshots: (files: File[]) => void;
  onScreenshotsChange: (files: File[]) => void;
}

// Generate stable key for each file
const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export function UploadSection({
  screenshots,
  onAddScreenshots,
  onScreenshotsChange,
}: UploadSectionProps) {
  // Create preview URLs once per file change
  const previews = useMemo(() => {
    return screenshots.map((file) => ({
      key: fileKey(file),
      file,
      url: URL.createObjectURL(file),
    }));
  }, [screenshots]);

  // Cleanup: revoke all blob URLs when component unmounts or previews change
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      
      const files = Array.from(e.target.files || []);
      
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      onAddScreenshots(imageFiles);
     
      
      e.target.value = '';
    },
    [onAddScreenshots]
  );
  const handleRemoveScreenshot = (index: number) => {
    const updated = screenshots.filter((_, i) => i !== index);
    onScreenshotsChange(updated);
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Step 1
          </p>
          <h2 className="font-display mt-2 text-2xl text-[var(--ink)]">
            Upload screenshots
          </h2>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          {screenshots.length}/10 uploaded
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        Add 1-10 PNG or JPG screens. We'll use them to generate promo variations.
      </p>

      <div className="mt-5">
        <label className="group flex w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-6 py-10 transition hover:border-[var(--accent)] hover:bg-white">
          <div className="text-center">
            <svg
              className="mx-auto h-10 w-10 text-[var(--muted)] transition group-hover:text-[var(--accent)]"
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
            <p className="mt-3 text-sm font-medium text-[var(--ink)]">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Up to 10 files, 10MB max each
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
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {previews.map((preview, index) => (
              <div key={preview.key} className="group relative">
                <img
                  src={preview.url}
                  alt={`Screenshot ${index + 1}`}
                  className="h-32 w-full rounded-xl border border-[var(--border)] object-cover shadow-sm"
                />
                <button
                  onClick={() => handleRemoveScreenshot(index)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  x
                </button>
                <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {screenshots.length === 0 && (
        <p className="mt-4 text-sm font-medium text-amber-700">
          Please upload at least 1 screenshot to begin.
        </p>
      )}
    </div>
  );
}
