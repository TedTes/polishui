'use client';

import React, { useState, useEffect } from 'react';

const ONBOARDING_STEPS = [
  {
    title: 'Upload Your Screenshots',
    description: 'Drag and drop 1-10 app screenshots to get started. We support PNG, JPG, and WEBP formats.',
    icon: '📱',
    target: 'upload'
  },
  {
    title: 'Customize Your Copy',
    description: 'Add a headline and value bullets, or let AI suggest them for you. All text is Apple App Store compliant.',
    icon: '✏️',
    target: 'form'
  },
  {
    title: 'Generate Variations',
    description: 'Click generate to create multiple professional variations. Download everything as a ZIP file.',
    icon: '✨',
    target: 'generate'
  }
];

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export default function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-fadeIn">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className="text-6xl text-center mb-4">
          {step.icon}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {step.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isLastStep ? "Get Started" : "Next"}
          </button>
        </div>

        {/* Step Counter */}
        <p className="text-center text-sm text-gray-500 mt-4">
          {currentStep + 1} of {ONBOARDING_STEPS.length}
        </p>
      </div>
    </div>
  );
}