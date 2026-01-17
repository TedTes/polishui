'use client';

import React, { useState } from 'react';

interface UploadSectionProps {
  uploadedImages: File[];
  onUpload: (files: File[]) => void;
}

export default function UploadSection({ uploadedImages, onUpload }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      if (filesArray.length + uploadedImages.length > 10) {
        alert('Maximum 10 images allowed');
        return;
      }
      onUpload([...uploadedImages, ...filesArray]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter - 1 === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length + uploadedImages.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }

    if (files.length > 0) {
      onUpload([...uploadedImages, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    onUpload(newImages);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all uploaded screenshots?')) {
      onUpload([]);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upload Screenshots</h2>
        {uploadedImages.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Drag-drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="pointer-events-none">
          <svg
            className={`mx-auto h-12 w-12 mb-4 transition-colors ${
              isDragging ? 'text-blue-500' : 'text-gray-400'
            }`}
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
          <p className={`text-sm mb-2 ${isDragging ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
            {isDragging ? 'Drop images here' : 'Drag & drop screenshots, or click to browse'}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP • 1-10 images • Max 10MB each
          </p>
        </div>
      </div>

      {/* Uploaded images counter and validation */}
      {uploadedImages.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">{uploadedImages.length}</span> of 10 images uploaded
          </p>
          {uploadedImages.length === 10 && (
            <p className="text-amber-600 text-xs">Maximum reached</p>
          )}
        </div>
      )}

      {/* Thumbnail grid */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Screenshots</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative group aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Remove button overlay */}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Remove screenshot ${index + 1}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Image index badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}