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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Step 3
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-[var(--ink)]">
          Preview your storyboard
        </h2>
        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          {storyboard.slides.length} slides generated
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        Review the slides below, then export when you're ready.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storyboard.slides.map((slide: any) => (
          <div
            key={slide.id}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] shadow-sm"
          >
            {/* Screenshot Preview */}
            <div className="relative aspect-[9/19.5] bg-white">
              <img
                src={getScreenshotUrl(slide.screenshot.screenshotId)}
                alt={`Slide ${slide.id}`}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Slide Info */}
            <div className="p-4">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                Slide {slide.id} - {slide.type}
              </div>
              <h3 className="mt-2 font-display text-lg text-[var(--ink)]">
                {slide.text.headline}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {slide.text.subheadline}
              </p>
              <div className="mt-3 text-xs text-[var(--muted)]">
                Template: {slide.templateId}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Info */}
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <h4 className="text-sm font-semibold text-emerald-900">Ready to export</h4>
        <p className="mt-1 text-sm text-emerald-800">
          Clicking "Export ZIP" will generate 10 images:
        </p>
        <ul className="mt-2 list-disc list-inside text-sm text-emerald-800">
          <li>5 iPhone screenshots (1290x2796)</li>
          <li>5 iPad screenshots (2064x2752)</li>
        </ul>
      </div>
    </div>
  );
}
