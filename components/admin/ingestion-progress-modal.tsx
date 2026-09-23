'use client';

import React from 'react';
import { IngestRowResult } from '@/actions/admin-products';
import { RefreshCw, CheckCircle2, AlertTriangle, Image as ImageIcon, Folder, ArrowRight } from 'lucide-react';

interface IngestionProgressModalProps {
  isOpen: boolean;
  totalItems: number;
  currentIndex: number;
  currentProductName: string;
  isFinished: boolean;
  results: IngestRowResult[];
  onClose: () => void;
}

export function IngestionProgressModal({
  isOpen,
  totalItems,
  currentIndex,
  currentProductName,
  isFinished,
  results,
  onClose,
}: IngestionProgressModalProps) {
  if (!isOpen) return null;

  const percentage = totalItems > 0 ? Math.min(Math.round((currentIndex / totalItems) * 100), 100) : 0;
  const successfulItems = results.filter((r) => r.success);
  const itemsWithDriveErrors = results.filter((r) => r.driveError);
  const totalUploadedImages = results.reduce((acc, r) => acc + (r.uploadedImagesCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-parchment border-2 border-brass/40 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {!isFinished ? (
          /* ACTIVE INGESTION LOADER STATE */
          <div className="p-8 sm:p-10 space-y-6 text-center">
            {/* Animated Spinner Icon */}
            <div className="w-20 h-20 bg-sandstone rounded-full flex items-center justify-center mx-auto border-2 border-brass/50 shadow-craft-md relative">
              <RefreshCw className="w-10 h-10 text-lapis animate-spin" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-brass rounded-full flex items-center justify-center text-parchment text-[10px] font-bold shadow">
                <Folder className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal tracking-wide">
                Ingesting Products & Migrating Media
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg mx-auto">
                Downloading high-resolution product photography from Google Drive and deploying to Supabase Storage CDN. Please keep this browser window open; this process takes 1–3 minutes.
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="space-y-2.5 bg-sandstone/80 p-5 rounded-xl border border-border text-left shadow-inner">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-charcoal flex items-center gap-2 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Processing product {Math.min(currentIndex + 1, totalItems)} of {totalItems}
                </span>
                <span className="text-lapis font-bold font-mono text-sm">{percentage}%</span>
              </div>

              {/* Bar track */}
              <div className="w-full h-3.5 bg-border/60 rounded-full overflow-hidden p-0.5 border border-border/40">
                <div
                  className="h-full bg-gradient-to-r from-lapis via-brass to-lapis rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Currently active item label */}
              <p className="text-xs font-medium text-terracotta truncate pt-1 font-serif">
                Active Product: <span className="font-sans font-semibold text-charcoal">{currentProductName || 'Initializing product payload...'}</span>
              </p>
            </div>

            <div className="text-[11px] text-muted italic flex items-center justify-center gap-1.5">
              <span>✦ Live Supabase Storage CDN deployment & Google Drive authentication active</span>
            </div>
          </div>
        ) : (
          /* POST-INGESTION SUMMARY REPORT STATE */
          <div className="p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-300 shadow-sm">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  Ingestion & Media Migration Complete!
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Successfully processed catalog spreadsheet rows and updated Supabase database.
                </p>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-sandstone rounded-xl border border-border text-center">
                <span className="text-[11px] text-muted block font-semibold">Ingested Products</span>
                <span className="font-serif text-2xl font-bold text-charcoal">{successfulItems.length}</span>
              </div>
              <div className="p-3.5 bg-sandstone rounded-xl border border-border text-center">
                <span className="text-[11px] text-muted block font-semibold">Uploaded Images</span>
                <span className="font-serif text-2xl font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <ImageIcon className="w-4 h-4" /> {totalUploadedImages}
                </span>
              </div>
              <div className="p-3.5 bg-sandstone rounded-xl border border-border text-center">
                <span className="text-[11px] text-muted block font-semibold">Drive Warnings</span>
                <span className={`font-serif text-2xl font-bold ${itemsWithDriveErrors.length > 0 ? 'text-terracotta' : 'text-muted'}`}>
                  {itemsWithDriveErrors.length}
                </span>
              </div>
            </div>

            {/* Drive Permission Warnings Section */}
            {itemsWithDriveErrors.length > 0 && (
              <div className="space-y-3 bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Google Drive Permission Notices ({itemsWithDriveErrors.length} folders)</span>
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  The following items had inaccessible Google Drive folders and were assigned placeholder fallbacks. Ensure Google Drive folders are shared with <strong>ghz-bulk-insert@igneous-spider-509401-u9.iam.gserviceaccount.com</strong> as Viewer:
                </p>

                <div className="max-h-40 overflow-y-auto space-y-2 border border-amber-200/60 rounded-lg p-2.5 bg-parchment/90">
                  {itemsWithDriveErrors.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-3 border-b border-amber-100 pb-2 last:border-none">
                      <div>
                        <span className="font-bold text-charcoal font-serif">{item.productName}</span>
                        {item.adminName !== item.productName && (
                          <span className="text-[10px] text-muted block font-mono">Internal: {item.adminName}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-terracotta bg-red-100/70 px-2 py-0.5 rounded shrink-0 font-semibold">
                        {item.driveError}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Details Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider font-serif">
                Ingested Products Summary
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 border border-border rounded-xl p-3 bg-sandstone/60 font-sans text-xs">
                {results.map((res, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-none">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${res.success ? 'bg-emerald-600' : 'bg-red-500'}`}></span>
                      <span className="font-semibold text-charcoal truncate">{res.productName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono">
                      {res.uploadedImagesCount > 0 ? (
                        <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-bold">
                          {res.uploadedImagesCount} Drive Images Synced
                        </span>
                      ) : (
                        <span className="text-muted bg-sandstone px-2 py-0.5 rounded border border-border">
                          Placeholder Assigned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-6 bg-lapis hover:bg-lapis/90 text-parchment font-semibold text-xs rounded-xl shadow-craft-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Close & Return to Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
