'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnhancedUploadZoneProps {
  uploadedImages: File[];
  onUpload: (files: File[]) => void;
}

export default function UploadSection({ uploadedImages, onUpload }: EnhancedUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`);
      } else if (uploadedImages.length + validFiles.length >= MAX_FILES) {
        errors.push(`Maximum ${MAX_FILES} files allowed`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors[0]);
      setTimeout(() => setError(null), 4000);
    }

    return validFiles;
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload([...uploadedImages, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      onUpload([...uploadedImages, ...files]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onUpload(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const progress = (uploadedImages.length / MAX_FILES) * 100;

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 lg:p-12 
          transition-all duration-300 cursor-pointer group
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : uploadedImages.length > 0
              ? 'border-green-300 bg-green-50/50 hover:bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-4
            transition-all duration-300
            ${isDragging 
              ? 'bg-blue-500 scale-110' 
              : uploadedImages.length > 0
                ? 'bg-green-500'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110'
            }
          `}>
            {uploadedImages.length > 0 ? (
              <CheckCircle2 className="w-8 h-8 text-white" />
            ) : (
              <Upload className={`w-8 h-8 text-white ${isDragging ? 'animate-bounce' : ''}`} />
            )}
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {uploadedImages.length > 0 
              ? `${uploadedImages.length} Screenshot${uploadedImages.length !== 1 ? 's' : ''} Uploaded`
              : isDragging 
                ? 'Drop your screenshots here'
                : 'Upload App Screenshots'
            }
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            {uploadedImages.length > 0 
              ? 'Add more or drag to reorder'
              : 'Drag & drop or click to browse'
            }
          </p>

          {/* File specs */}
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
              PNG, JPG, WEBP
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
              Max 10MB
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
              {uploadedImages.length}/{MAX_FILES} files
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {uploadedImages.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-slideDown">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Uploaded Screenshots ({uploadedImages.length})
            </h3>
            {uploadedImages.length === MAX_FILES && (
              <span className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                Maximum reached
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {uploadedImages.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                  aria-label={`Remove screenshot ${index + 1}`}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Index badge */}
                <div className="absolute bottom-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* File name on hover */}
                <div className="absolute bottom-2 right-2 max-w-[calc(100%-3rem)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-gray-900 truncate">
                    {file.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
