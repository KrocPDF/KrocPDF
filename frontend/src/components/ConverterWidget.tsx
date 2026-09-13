'use client';

import { useState, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useConversion } from '@/hooks/useConversion';
import { uploadFileToS3 } from '@/lib/uploader';
import {
  generateLocalPdf,
  mergePdfsLocally,
  LayoutSettings,
} from '@/lib/localConverter';
import { DEFAULT_FILTER_OPTIONS, FilterOptions } from '@/lib/documentFilter';
import { ScanPreviewModal, PreviewImageItem } from '@/components/ScanPreviewModal';
import { API_BASE_URL } from '@/lib/api';
import { validateImageHeader } from '@/lib/sanitizer';
import { validatePdfBinary } from '@/lib/binaryValidator';
import { PrivacyTimer } from '@/components/PrivacyTimer';
import {
  UploadCloud,
  GripVertical,
  X,
  FileImage,
  Settings,
  Loader2,
  Sparkles,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';

interface ImageFile extends PreviewImageItem {
  rawPreviewUrl: string;
  isEnhanced?: boolean;
}

export function ConverterWidget({ tool = 'unified' }: { tool?: string }) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<LayoutSettings & { engine: string }>({
    pageSize: 'A4',
    orientation: 'PORTRAIT',
    margins: 'NONE',
    dpi: 150,
    engine: 'local',
    transparencyMode: 'flatten_white',
    documentScannerMode: false,
    filterOptions: DEFAULT_FILTER_OPTIONS,
    perImageOptions: {},
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);

  const {
    status,
    setStatus,
    progress,
    setProgress,
    message,
    setMessage,
    downloadUrl,
    setDownloadUrl,
    jobId,
    triggerJobAndListen,
    cleanupSSE,
  } = useConversion();

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
        if (img.rawPreviewUrl !== img.previewUrl) {
          URL.revokeObjectURL(img.rawPreviewUrl);
        }
      });
      cleanupSSE();
    };
  }, [images, cleanupSSE]);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      if (status !== 'IDLE' && status !== 'ERROR') return;

      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => {
        if (tool === 'merge-pdf') return f.type === 'application/pdf';
        if (tool !== 'unified')
          return (
            f.type === 'image/jpeg' ||
            f.type === 'image/png' ||
            f.type === 'image/webp'
          );
        return (
          f.type === 'image/jpeg' ||
          f.type === 'image/png' ||
          f.type === 'image/webp' ||
          f.type === 'application/pdf'
        );
      });

      const validFiles: File[] = [];
      for (const f of droppedFiles) {
        if (f.type === 'application/pdf') {
          if (await validatePdfBinary(f)) {
            validFiles.push(f);
          } else {
            setStatus('ERROR');
            setMessage(`Invalid or corrupt PDF: ${f.name}`);
          }
        } else {
          if (await validateImageHeader(f)) {
            validFiles.push(f);
          } else {
            setStatus('ERROR');
            setMessage(`Invalid or corrupt image: ${f.name}`);
          }
        }
      }

      const newImages = validFiles.map((file) => {
        const url = URL.createObjectURL(file);
        return {
          id: crypto.randomUUID(),
          file,
          previewUrl: url,
          rawPreviewUrl: url,
          isEnhanced: false,
        };
      });

      setImages((prev) => {
        const nextImages = [...prev, ...newImages];
        const totalBytes = nextImages.reduce(
          (sum, img) => sum + img.file.size,
          0,
        );
        const hasPdf = nextImages.some(
          (img) => img.file.type === 'application/pdf',
        );

        const isMassive = hasPdf
          ? nextImages.length > 15 || totalBytes > 25 * 1024 * 1024
          : nextImages.length > 20 || totalBytes > 50 * 1024 * 1024;

        if (isMassive) {
          setSettings((s) => ({ ...s, engine: 'cloud' }));
          setToastMsg(
            'Payload too large for local processing. Falling back to Cloud Batch Mode.',
          );
          setTimeout(() => setToastMsg(null), 5000);
        }
        return nextImages;
      });
    },
    [status, setStatus, setMessage, tool],
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.previewUrl);
        if (img.rawPreviewUrl !== img.previewUrl) {
          URL.revokeObjectURL(img.rawPreviewUrl);
        }
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Handler: Apply filter to single active page
  const handleApplyToPage = (
    imageId: string,
    options: FilterOptions,
    enhancedBlob: Blob,
  ) => {
    const targetImg = images.find((i) => i.id === imageId);
    if (!targetImg) return;

    const newPreviewUrl = URL.createObjectURL(enhancedBlob);

    setImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId) {
          if (img.previewUrl !== img.rawPreviewUrl) {
            URL.revokeObjectURL(img.previewUrl);
          }
          return {
            ...img,
            previewUrl: newPreviewUrl,
            filterOptions: options,
            isEnhanced: true,
          };
        }
        return img;
      }),
    );

    setSettings((s) => ({
      ...s,
      perImageOptions: {
        ...(s.perImageOptions || {}),
        [targetImg.file.name]: options,
      },
    }));

    setToastMsg(`✨ Filter applied to ${targetImg.file.name}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Handler: Batch apply filter to all pages
  const handleApplyToAll = (options: FilterOptions) => {
    setSettings((s) => ({
      ...s,
      documentScannerMode: true,
      filterOptions: options,
    }));

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        filterOptions: options,
        isEnhanced: true,
      })),
    );

    setToastMsg(`✨ Scanner filter applied to all ${images.length} pages!`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const startConversion = async () => {
    if (images.length === 0) return;

    try {
      setStatus('UPLOADING');
      setProgress(0);

      if (settings.engine === 'local') {
        setMessage('Generating PDF locally in your browser...');
        try {
          const hasPdf = images.some(
            (img) => img.file.type === 'application/pdf',
          );
          let url;
          if (hasPdf) {
            url = await mergePdfsLocally(
              images.map((img) => img.file),
              (percent) => setProgress(percent),
            );
          } else {
            url = await generateLocalPdf(
              images.map((img) => img.file),
              settings,
              (percent) => setProgress(percent),
            );
          }
          setMessage('Local conversion complete!');
          setDownloadUrl(url); // Set download directly, skipping SSE
          setStatus('READY');
          return;
        } catch (err: unknown) {
          if (err instanceof Error && err.message === 'MEMORY_FALLBACK') {
            setSettings((s) => ({ ...s, engine: 'cloud' }));
            setToastMsg(
              'File too large for browser. Using secure cloud worker. Automatically deleted in 1 hour.',
            );
            setTimeout(() => setToastMsg(null), 5000);
            // Fall through to cloud conversion
          } else {
            throw err;
          }
        }
      }

      setMessage('Requesting upload URLs...');
      const hasPdf = images.some(
        (img) => img.file.type === 'application/pdf',
      );
      const jobType = hasPdf ? 'MERGE_PDF' : 'IMAGE_TO_PDF';

      const payload = {
        jobType,
        settings,
        files: images.map((img) => ({
          fileName: img.file.name,
          mimeType: img.file.type,
          sizeBytes: img.file.size,
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/conversions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok)
        throw new Error(
          'Failed to initiate conversion. Ensure the backend is running.',
        );
      const data = await res.json();

      setMessage('Uploading images securely to storage...');

      let completedUploads = 0;

      const uploadPromises = images.map((img, i) => {
        const target = data.uploadTargets.find(
          (t: { sequenceOrder: number; presignedPutUrl: string }) =>
            t.sequenceOrder === i,
        );
        if (!target)
          throw new Error('Missing upload target for sequence ' + i);

        return uploadFileToS3(img.file, target.presignedPutUrl).then(() => {
          completedUploads++;
          setProgress((completedUploads / images.length) * 100);
        });
      });

      await Promise.all(uploadPromises);

      await triggerJobAndListen(data.jobId);
    } catch (err: unknown) {
      setStatus('ERROR');
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  return (
    <div className="max-w-4xl w-full space-y-8 relative">
      {toastMsg && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[calc(100%+1rem)] z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl shadow-emerald-950/50 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2 text-sm font-semibold border border-emerald-400/30">
          {toastMsg}
        </div>
      )}

      {/* Status Banner */}
      {status !== 'IDLE' && (
        <div
          className={clsx(
            'p-6 rounded-2xl border text-center space-y-4',
            status === 'ERROR'
              ? 'bg-red-950/30 border-red-900/50 text-red-400'
              : status === 'READY'
                ? 'bg-green-950/30 border-green-900/50 text-green-400'
                : 'bg-blue-950/30 border-blue-900/50 text-blue-400',
          )}
        >
          <div className="font-medium text-lg flex items-center justify-center">
            {(status === 'UPLOADING' || status === 'PROCESSING') && (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            )}
            {message}
          </div>

          {(status === 'UPLOADING' || status === 'PROCESSING') && (
            <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden border border-neutral-800">
              <div
                className="bg-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {status === 'READY' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download="converted.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition shadow-lg shadow-green-900/20"
                >
                  Download PDF
                </a>
              )}
              <button
                onClick={() => {
                  setImages([]);
                  setStatus('IDLE');
                }}
                className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white font-medium transition"
              >
                Convert Another
              </button>
            </div>
          )}

          {status === 'READY' && jobId && (
            <PrivacyTimer
              jobId={jobId}
              onDelete={() => {
                setStatus('IDLE');
                setImages([]);
                setMessage('Files successfully deleted from server.');
              }}
            />
          )}

          {status === 'ERROR' && (
            <button
              onClick={() => setStatus('IDLE')}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Main Workspace */}
      {(status === 'IDLE' || status === 'ERROR') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Dropzone */}
          <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="md:col-span-2 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer min-h-[300px]"
          >
            <UploadCloud className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-slate-100">
              {tool === 'merge-pdf'
                ? 'Drag & Drop PDFs here'
                : 'Drag & Drop images here'}
            </h3>
            <p className="text-slate-400 mb-6">
              {tool === 'merge-pdf'
                ? 'Supports .PDF files'
                : 'Supports .JPG, .JPEG, .PNG up to 50 Megapixels'}
            </p>

            <label className="px-6 py-3 bg-slate-100 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 hover:text-slate-950 transition-all cursor-pointer shadow-xl shadow-black/30">
              Browse Files
              <input
                type="file"
                multiple
                accept={
                  tool === 'merge-pdf'
                    ? 'application/pdf'
                    : tool === 'unified'
                      ? 'image/jpeg, image/png, application/pdf'
                      : 'image/jpeg, image/png'
                }
                className="hidden"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  const selectedFiles = Array.from(e.target.files);
                  const validFiles: File[] = [];
                  for (const f of selectedFiles) {
                    if (f.type === 'application/pdf') {
                      if (await validatePdfBinary(f)) {
                        validFiles.push(f);
                      } else {
                        setStatus('ERROR');
                        setMessage(`Invalid or corrupt PDF: ${f.name}`);
                      }
                    } else {
                      if (await validateImageHeader(f)) {
                        validFiles.push(f);
                      } else {
                        setStatus('ERROR');
                        setMessage(`Invalid or corrupt image: ${f.name}`);
                      }
                    }
                  }
                  const newImages = validFiles.map((file) => {
                    const url = URL.createObjectURL(file);
                    return {
                      id: crypto.randomUUID(),
                      file,
                      previewUrl: url,
                      rawPreviewUrl: url,
                      isEnhanced: false,
                    };
                  });
                  setImages((prev) => {
                    const nextImages = [...prev, ...newImages];
                    const totalBytes = nextImages.reduce(
                      (sum, img) => sum + img.file.size,
                      0,
                    );
                    const hasPdf = nextImages.some(
                      (img) => img.file.type === 'application/pdf',
                    );
                    const isMassive = hasPdf
                      ? nextImages.length > 15 || totalBytes > 25 * 1024 * 1024
                      : nextImages.length > 20 || totalBytes > 50 * 1024 * 1024;

                    if (isMassive) {
                      setSettings((s) => ({ ...s, engine: 'cloud' }));
                      setToastMsg(
                        'Payload too large for local processing. Falling back to Cloud Batch Mode.',
                      );
                      setTimeout(() => setToastMsg(null), 5000);
                    }
                    return nextImages;
                  });
                }}
              />
            </label>
          </div>

          {/* Right: Settings */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-slate-200 mb-6">
                <Settings className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">Document Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-400">
                    Processing Engine
                  </label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, engine: 'cloud' })
                      }
                      className={clsx(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
                        settings.engine === 'cloud'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      Force Cloud
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings({ ...settings, engine: 'local' })
                      }
                      disabled={
                        images.length > 20 ||
                        images.reduce((sum, img) => sum + img.file.size, 0) >
                          50 * 1024 * 1024
                      }
                      className={clsx(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                        settings.engine === 'local'
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      Force Local
                    </button>
                  </div>
                </div>

                <label className="block text-sm text-slate-400">
                  Page Size
                  <select
                    value={settings.pageSize}
                    onChange={(e) =>
                      setSettings({ ...settings, pageSize: e.target.value })
                    }
                    className="mt-1 block w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                  >
                    <option value="A4">A4</option>
                    <option value="LETTER">Letter</option>
                    <option value="FIT_TO_IMAGE">Fit to Image</option>
                  </select>
                </label>

                <label className="block text-sm text-slate-400">
                  Orientation
                  <select
                    value={settings.orientation}
                    onChange={(e) =>
                      setSettings({ ...settings, orientation: e.target.value })
                    }
                    className="mt-1 block w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                  >
                    <option value="PORTRAIT">Portrait</option>
                    <option value="LANDSCAPE">Landscape</option>
                    <option value="AUTO">Auto</option>
                  </select>
                </label>

                <label className="block text-sm text-slate-400">
                  Margins
                  <select
                    value={settings.margins}
                    onChange={(e) =>
                      setSettings({ ...settings, margins: e.target.value })
                    }
                    className="mt-1 block w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                  >
                    <option value="NONE">None</option>
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                  </select>
                </label>

                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Transparency Mode</p>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          transparencyMode: 'flatten_white',
                        })
                      }
                      className={clsx(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition',
                        settings.transparencyMode === 'flatten_white'
                          ? 'bg-slate-200 text-slate-950 shadow-md font-semibold'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      White
                    </button>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          transparencyMode: 'flatten_black',
                        })
                      }
                      className={clsx(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition',
                        settings.transparencyMode === 'flatten_black'
                          ? 'bg-slate-800 text-white shadow-md border border-slate-700 font-semibold'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      Black
                    </button>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          transparencyMode: 'keep_transparent',
                        })
                      }
                      className={clsx(
                        'flex-1 py-1.5 text-xs font-medium rounded-md transition',
                        settings.transparencyMode === 'keep_transparent'
                          ? 'bg-emerald-600 text-white shadow-md font-semibold'
                          : 'text-slate-400 hover:text-white',
                      )}
                    >
                      Preserve
                    </button>
                  </div>
                </div>

                {/* Document Scanner Mode (Whitening & Shadow Removal) */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200">
                        Scanner Mode
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          documentScannerMode: !s.documentScannerMode,
                        }))
                      }
                      className={clsx(
                        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                        settings.documentScannerMode
                          ? 'bg-emerald-500'
                          : 'bg-slate-800',
                      )}
                    >
                      <span
                        className={clsx(
                          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                          settings.documentScannerMode
                            ? 'translate-x-4'
                            : 'translate-x-0',
                        )}
                      />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Whitens yellow paper, flattens shadows & sharpens document
                    text.
                  </p>

                  {settings.documentScannerMode && (
                    <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        {(
                          [
                            'color-enhance',
                            'monochrome',
                            'high-contrast',
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() =>
                              setSettings((s) => ({
                                ...s,
                                filterOptions: {
                                  ...(s.filterOptions ||
                                    DEFAULT_FILTER_OPTIONS),
                                  mode,
                                },
                              }))
                            }
                            className={clsx(
                              'py-1 text-[10px] font-medium rounded transition text-center',
                              settings.filterOptions?.mode === mode
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'text-slate-400 hover:text-white',
                            )}
                          >
                            {mode === 'color-enhance'
                              ? 'Color'
                              : mode === 'monochrome'
                                ? 'B&W'
                                : 'Contrast'}
                          </button>
                        ))}
                      </div>

                      {images.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setActivePreviewIndex(0);
                            setIsPreviewModalOpen(true);
                          }}
                          className="w-full py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Open Scanner Editor
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={startConversion}
              disabled={images.length === 0}
              className="w-full mt-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-emerald-950/40"
            >
              Convert to PDF
            </button>
          </div>
        </div>
      )}

              {/* Sortable Grid */}
      {(status === 'IDLE' || status === 'ERROR') && images.length > 0 && (
        <div className="pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium flex items-center text-slate-100">
              <FileImage className="w-5 h-5 mr-2 text-emerald-400" />
              Reorder Pages ({images.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                setActivePreviewIndex(0);
                setIsPreviewModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Multi-Page Scanner Editor
            </button>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-4"
                >
                  {images.map((img, index) => (
                    <Draggable key={img.id} draggableId={img.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={clsx(
                            'relative group w-32 h-44 rounded-xl overflow-hidden border-2 flex flex-col justify-between',
                            snapshot.isDragging
                              ? 'border-blue-500 shadow-xl shadow-blue-500/20'
                              : img.isEnhanced
                                ? 'border-emerald-500/70 shadow-lg shadow-emerald-950/40'
                                : 'border-neutral-800',
                          )}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h8v8H0zM8 8h8v8H8z' fill='%231a1a1a' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                            backgroundSize: '16px 16px',
                            backgroundColor: '#262626',
                          }}
                        >
                          {/* Active Enhanced Badge */}
                          {img.isEnhanced && (
                            <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-emerald-500 text-[9px] font-black text-slate-950 rounded shadow-md flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              {img.filterOptions?.mode === 'monochrome'
                                ? 'B&W'
                                : img.filterOptions?.mode === 'high-contrast'
                                  ? 'Contrast'
                                  : 'Color'}
                            </div>
                          )}

                          {/* Top Right Remove */}
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <button
                              onClick={() => removeImage(img.id)}
                              className="bg-red-500/90 p-1 rounded-md hover:bg-red-500 text-white shadow-md transition"
                              title="Remove page"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Thumbnail / PDF Fallback */}
                          {img.file.type === 'application/pdf' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 p-2">
                              <FileText className="w-10 h-10 text-slate-400 mb-1" />
                              <span className="text-[10px] text-slate-300 font-medium text-center truncate w-full">
                                {img.file.name}
                              </span>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={img.previewUrl}
                              alt={img.file.name}
                              className="w-full h-full object-cover"
                            />
                          )}

                          {/* Drag handle & Scanner Preview Overlay on Hover */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 gap-2">
                            {img.file.type !== 'application/pdf' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePreviewIndex(index);
                                  setIsPreviewModalOpen(true);
                                }}
                                title="Edit Scanner Filter for this page"
                                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold p-1.5 rounded-lg text-[10px] flex items-center gap-1 shadow-lg transition scale-95 hover:scale-100"
                              >
                                <Sparkles className="w-3 h-3" /> Edit Scan
                              </button>
                            )}

                            <div
                              {...provided.dragHandleProps}
                              className="p-1 cursor-grab active:cursor-grabbing text-white"
                              title="Drag to reorder"
                            >
                              <GripVertical className="w-5 h-5 text-slate-300" />
                            </div>
                          </div>

                          {/* Bottom Page Number & Filename Bar */}
                          <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 text-[10px] text-center py-1 truncate px-2 font-medium z-10 border-t border-neutral-800">
                            {index + 1}. {img.file.name}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Multi-Page Scanner Comparison Modal */}
      <ScanPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
        }}
        images={images}
        initialActiveIndex={activePreviewIndex}
        globalOptions={settings.filterOptions || DEFAULT_FILTER_OPTIONS}
        onApplyToPage={handleApplyToPage}
        onApplyToAll={handleApplyToAll}
      />
    </div>
  );
}
