'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  Check,
  RotateCcw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import {
  enhanceDocumentImage,
  FilterOptions,
  FilterMode,
  DEFAULT_FILTER_OPTIONS,
} from '@/lib/documentFilter';
import clsx from 'clsx';

export interface PreviewImageItem {
  id: string;
  file: File;
  previewUrl: string;
  filterOptions?: FilterOptions;
}

interface ScanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: PreviewImageItem[];
  initialActiveIndex?: number;
  globalOptions: FilterOptions;
  onApplyToPage: (imageId: string, options: FilterOptions, enhancedBlob: Blob) => void;
  onApplyToAll: (options: FilterOptions) => void;
}

export function ScanPreviewModal(props: ScanPreviewModalProps) {
  if (!props.isOpen || props.images.length === 0) {
    return null;
  }

  return (
    <ScanPreviewModalContent
      key={`${props.initialActiveIndex}-${props.images.map(image => image.id).join(',')}`}
      {...props}
    />
  );
}

function ScanPreviewModalContent({
  isOpen,
  onClose,
  images,
  initialActiveIndex = 0,
  globalOptions,
  onApplyToPage,
  onApplyToAll,
}: ScanPreviewModalProps) {
  const initialIndex = Math.min(
    initialActiveIndex,
    Math.max(0, images.length - 1),
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalDataUrl, setOriginalDataUrl] = useState<string>('');
  const [enhancedDataUrl, setEnhancedDataUrl] = useState<string>('');
  const [currentEnhancedBlob, setCurrentEnhancedBlob] = useState<Blob | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const activeImage = images[activeIndex];

  const [options, setOptions] = useState<FilterOptions>(
    images[initialIndex]?.filterOptions ||
      globalOptions ||
      DEFAULT_FILTER_OPTIONS,
  );

  const selectPage = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(images.length - 1, index));
      const nextImage = images[nextIndex];

      setActiveIndex(nextIndex);
      setOptions(
        nextImage?.filterOptions ||
          globalOptions ||
          DEFAULT_FILTER_OPTIONS,
      );
    },
    [images, globalOptions],
  );

  // Load active image file into Data URL
  useEffect(() => {
    if (!isOpen || !activeImage) return;

    let isMounted = true;
    const reader = new FileReader();
    reader.onload = () => {
      if (isMounted && typeof reader.result === 'string') {
        setOriginalDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(activeImage.file);

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeImage]);

  // Process filter preview
  useEffect(() => {
    if (!isOpen || !originalDataUrl) return;

    let isMounted = true;

    const processFilter = async () => {
      setIsProcessing(true);
      try {
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image decode error'));
          img.src = originalDataUrl;
        });

        const enhancedBlob = await enhanceDocumentImage(img, options);
        if (isMounted) {
          setCurrentEnhancedBlob(enhancedBlob);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && typeof reader.result === 'string') {
            setEnhancedDataUrl(reader.result);
          }
        };
        reader.readAsDataURL(enhancedBlob);
      } catch (err: unknown) {
        console.error('Error in document enhancement preview:', err);
      } finally {
        if (isMounted) setIsProcessing(false);
      }
    };

    processFilter();

    return () => {
      isMounted = false;
    };
  }, [isOpen, originalDataUrl, options]);

  const handleSliderMove = useCallback((clientX: number, targetElement: HTMLElement) => {
    const rect = targetElement.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById('scan-slider-container');
        if (container) handleSliderMove(e.clientX, container);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        const container = document.getElementById('scan-slider-container');
        if (container) handleSliderMove(e.touches[0].clientX, container);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleSliderMove]);

  // Keyboard navigation for Prev/Next page
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        selectPage(activeIndex - 1);
      } else if (e.key === 'ArrowRight' && activeIndex < images.length - 1) {
        selectPage(activeIndex + 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length, onClose, selectPage]);

  if (!isOpen || images.length === 0 || !activeImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header with Multi-Page Navigation */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base sm:text-lg">
                  Document Scanner Editor
                </h3>
                <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-mono font-medium rounded-md">
                  Page {activeIndex + 1} of {images.length}
                </span>
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-emerald-400 ml-1" />}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                {activeImage.file.name}
              </p>
            </div>
          </div>

          {/* Quick Nav & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => selectPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => selectPage(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Viewport */}
        <div className="relative w-full p-4 sm:p-5 bg-slate-900/30 select-none flex items-center justify-center overflow-hidden">
          <div
            id="scan-slider-container"
            className="relative w-full h-[320px] sm:h-[420px] flex items-center justify-center rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {/* Enhanced Image (Full Background) */}
            {enhancedDataUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={enhancedDataUrl}
                alt="Enhanced document scan"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none p-2"
              />
            ) : (
              <div className="flex items-center justify-center text-slate-400 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mr-2 text-emerald-400" /> Applying scanner filter...
              </div>
            )}

            {/* Original Image (Left Side clipped with polygon) */}
            {originalDataUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={originalDataUrl}
                alt="Original photo"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none p-2"
                style={{
                  clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                }}
              />
            )}

            {/* Vertical Draggable Divider */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-2xl flex items-center justify-center text-xs font-bold -translate-x-1/2 cursor-grab active:cursor-grabbing">
                ⇄
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-medium text-amber-300 border border-amber-500/30 shadow-lg">
              Original Photo
            </div>
            <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-medium text-emerald-300 border border-emerald-500/30 shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Enhanced Scan
            </div>
          </div>
        </div>

        {/* Thumbnail Carousel Strip for Multi-Page Switching */}
        {images.length > 1 && (
          <div className="px-5 py-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5" /> Pages:
            </span>
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => selectPage(idx)}
                className={clsx(
                  "relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                  activeIndex === idx
                    ? "border-emerald-400 ring-2 ring-emerald-500/30 scale-105"
                    : "border-slate-800 opacity-60 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.previewUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-white text-center font-bold">
                  {idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Filter Controls & Dual Apply Buttons */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/90 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Mode Selector */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">Enhancement Mode</label>
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['color-enhance', 'monochrome', 'high-contrast'] as FilterMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOptions(o => ({ ...o, mode }))}
                    className={clsx(
                      "py-2 px-3 text-xs font-semibold rounded-lg transition-all capitalize text-center",
                      options.mode === mode
                        ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    {mode === 'color-enhance' ? 'Color Scan' : mode === 'monochrome' ? 'B&W Mono' : 'High Contrast'}
                  </button>
                ))}
              </div>
            </div>

            {/* Whitening Boost Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> Whitening Boost</span>
                <span className="text-emerald-400 font-mono font-medium">{options.gamma.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.2"
                step="0.1"
                value={options.gamma}
                onChange={(e) => setOptions(o => ({ ...o, gamma: parseFloat(e.target.value) }))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-950 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Action Footer: Apply to Page vs Apply to All */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setOptions(DEFAULT_FILTER_OPTIONS)}
              className="inline-flex items-center text-xs text-slate-400 hover:text-white transition gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-800 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
              >
                Close
              </button>
              
              {/* Apply to Active Page */}
              <button
                type="button"
                onClick={() => {
                  if (currentEnhancedBlob) {
                    onApplyToPage(activeImage.id, options, currentEnhancedBlob);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-xl transition"
              >
                <Check className="w-3.5 h-3.5" /> Apply to Page {activeIndex + 1}
              </button>

              {/* Apply to All Pages */}
              <button
                type="button"
                onClick={() => {
                  onApplyToAll(options);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-950/40 transition"
              >
                <Check className="w-4 h-4" /> Apply to All Pages
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
