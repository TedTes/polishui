'use client';

interface StoryboardPreviewProps {
  storyboard: any;
  screenshots: File[];
}

export function StoryboardPreview({ storyboard, screenshots }: StoryboardPreviewProps) {
  const getScreenshotUrl = (screenshotId: string) => {
    const index = parseInt(screenshotId.replace('screenshot-', '')) - 1;
    const file = screenshots[index];
    return file ? URL.createObjectURL(file) : '';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        3. Preview Storyboard
      </h2>

      <p className="text-gray-600 mb-6">
        Your storyboard is ready! Review the 5 slides below, then export when ready.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storyboard.slides.map((slide: any) => (
          <div key={slide.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Screenshot Preview */}
            <div className="aspect-[9/19.5] bg-gray-100 relative">
              <img
                src={getScreenshotUrl(slide.screenshot.screenshotId)}
                alt={`Slide ${slide.id}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Slide Info */}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-2">
                Slide {slide.id} - {slide.type}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {slide.text.headline}
              </h3>
              <p className="text-sm text-gray-600">
                {slide.text.subheadline}
              </p>
              <div className="mt-2 text-xs text-gray-400">
                Template: {slide.templateId}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Ready to Export</h4>
        <p className="text-sm text-blue-800">
          Clicking "Export ZIP" will generate 10 images:
        </p>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
          <li>5 iPhone screenshots (1290×2796)</li>
          <li>5 iPad screenshots (2064×2752)</li>
        </ul>
      </div>
    </div>
  );
}