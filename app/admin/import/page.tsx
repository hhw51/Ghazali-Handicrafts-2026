'use client';

import { useState, useEffect } from 'react';
import { parseExcelBuffer, ParsedRowResult } from '@/lib/parsers/excel';
import { ingestSingleProductRow, previewGoogleSheetUrl, IngestRowResult } from '@/actions/admin-products';
import { SheetProductRow } from '@/lib/validations/product';
import { FileSpreadsheet, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { IngestionProgressModal } from '@/components/admin/ingestion-progress-modal';

export default function AdminImportPage() {
  const [activeTab, setActiveTab] = useState<'file' | 'sheets'>('file');

  // Local File State
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [results, setResults] = useState<ParsedRowResult[]>([]);
  const [validRows, setValidRows] = useState<SheetProductRow[]>([]);
  const [uploading, setUploading] = useState(false);

  // Ingestion Modal & Loader State
  const [ingestionModalOpen, setIngestionModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProductName, setCurrentProductName] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [ingestionResults, setIngestionResults] = useState<IngestRowResult[]>([]);

  // Google Sheets URL State
  const [sheetUrl, setSheetUrl] = useState('');
  const [fetchingSheet, setFetchingSheet] = useState(false);

  // Banners
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prevent accidental navigation during active media ingestion
  useEffect(() => {
    if (!uploading) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploading]);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setSuccessMessage(null);
    setErrorMessage(null);
    setParsing(true);

    try {
      const isCsv = selectedFile.name.endsWith('.csv');
      const arrayBuffer = await selectedFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parsed = await parseExcelBuffer(buffer, isCsv);

      setResults(parsed.results);
      setValidRows(parsed.validRows);
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(err.message || 'Failed to parse file. Make sure it is a valid .xlsx or .csv spreadsheet.');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFetchGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      setErrorMessage('Please enter a valid Google Sheet URL.');
      return;
    }

    setFetchingSheet(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setResults([]);
    setValidRows([]);

    const res = await previewGoogleSheetUrl(sheetUrl.trim());
    setFetchingSheet(false);

    if (res.success && res.results) {
      setResults(res.results);
      setValidRows(res.validRows || []);
      if (res.validRows?.length === 0) {
        setErrorMessage('Fetched Google Sheet successfully, but found 0 valid product rows.');
      }
    } else {
      setErrorMessage(
        res.error || 'Failed to fetch Google Sheet. Ensure sheet permission is set to "Anyone with link can view".'
      );
    }
  };

  const handleConfirmImport = async () => {
    if (validRows.length === 0) return;

    setUploading(true);
    setIngestionModalOpen(true);
    setIsFinished(false);
    setIngestionResults([]);
    setCurrentIndex(0);
    setSuccessMessage(null);
    setErrorMessage(null);

    const accumulatedResults: IngestRowResult[] = [];

    for (let i = 0; i < validRows.length; i++) {
      setCurrentIndex(i);
      const row = validRows[i];
      const activeName = row['short description (underneath product picture)']?.trim() || row.name;
      setCurrentProductName(activeName);

      const res = await ingestSingleProductRow(row);
      accumulatedResults.push(res);
      setIngestionResults([...accumulatedResults]);
    }

    setIsFinished(true);
    setUploading(false);

    const successCount = accumulatedResults.filter((r) => r.success).length;
    setSuccessMessage(`✓ Successfully ingested ${successCount} products into Supabase catalog!`);
  };

  const handleCloseModal = () => {
    setIngestionModalOpen(false);
    setFile(null);
    setResults([]);
    setValidRows([]);
    setSheetUrl('');
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">
          Bulk Google Sheet / Excel Ingestion
        </h1>
        <p className="text-xs text-muted mt-1">
          Upload `.xlsx` or `.csv` files, or paste a public Google Sheet link to parse, validate, and batch upsert products into Supabase.
        </p>
      </div>

      {/* Import Method Tabs */}
      <div className="flex border-b border-border space-x-4">
        <button
          type="button"
          onClick={() => {
            setActiveTab('file');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'file'
              ? 'border-lapis text-lapis'
              : 'border-transparent text-muted hover:text-charcoal'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Option 1: Drag & Drop File (.xlsx / .csv)
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('sheets');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'sheets'
              ? 'border-lapis text-lapis'
              : 'border-transparent text-muted hover:text-charcoal'
          }`}
        >
          <LinkIcon className="w-4 h-4" /> Option 2: Fetch Direct Google Sheet Link
        </button>
      </div>

      {/* Tab 1: Local File Drag & Drop */}
      {activeTab === 'file' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border hover:border-brass rounded-2xl p-10 text-center bg-sandstone/60 space-y-4 transition-colors cursor-pointer"
        >
          <div className="w-16 h-16 bg-parchment rounded-full flex items-center justify-center mx-auto border border-border text-brass shadow-craft-sm">
            <UploadCloud className="w-8 h-8 text-brass" />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal">
              Drag & Drop `.xlsx` or `.csv` catalog file here
            </h3>
            <p className="text-xs text-muted mt-1">
              Supports standard Google Sheet exports (`name`, `price`, `stock`, `category`, `images`, etc.)
            </p>
          </div>

          <label className="inline-block px-5 py-2.5 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-md cursor-pointer transition-colors shadow-craft-sm">
            <span>Browse File</span>
            <input
              type="file"
              accept=".xlsx, .csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>

          {file && (
            <p className="text-xs font-mono text-terracotta font-semibold">
              Selected File: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>
      )}

      {/* Tab 2: Direct Google Sheet URL */}
      {activeTab === 'sheets' && (
        <div className="p-8 bg-sandstone/60 border-2 border-border rounded-2xl space-y-4 shadow-craft-sm">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-lapis" /> Direct Google Sheet URL Fetcher
            </h3>
            <p className="text-xs text-muted">
              Paste the full URL of your public Google Sheet. Make sure Link Sharing is set to <strong>"Anyone with the link can view"</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="w-full px-4 py-3 text-xs bg-parchment border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono"
            />

            <button
              type="button"
              onClick={handleFetchGoogleSheet}
              disabled={fetchingSheet}
              className="w-full sm:w-auto shrink-0 px-6 py-3 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-lg shadow-craft-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {fetchingSheet ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-brass" /> Fetching Sheet...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 text-brass" /> Fetch & Preview Sheet
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {parsing && (
        <div className="p-4 bg-sandstone rounded-xl border border-border flex items-center gap-3 text-xs text-charcoal">
          <RefreshCw className="w-4 h-4 animate-spin text-lapis" />
          <span>Parsing spreadsheet and running Zod validation rules...</span>
        </div>
      )}

      {/* Success & Error Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Client-Side Validation Preview Table */}
      {results.length > 0 && (
        <div className="bg-sandstone rounded-xl border border-border p-6 space-y-6 shadow-craft-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-lapis" /> File Validation Preview
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Total Rows: {results.length} | Valid: <strong className="text-emerald-700">{validRows.length}</strong> | Errors: <strong className="text-terracotta">{results.length - validRows.length}</strong>
              </p>
            </div>

            <button
              onClick={handleConfirmImport}
              disabled={uploading || validRows.length === 0}
              className="px-6 py-3 bg-lapis hover:bg-lapis/90 text-parchment text-xs font-semibold rounded-md shadow-craft-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-brass" /> Batch Upserting...
                </>
              ) : (
                <>
                  Confirm & Batch Ingest {validRows.length} Valid Products <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-parchment border-b border-border text-charcoal font-serif font-bold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price (PKR)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Images</th>
                  <th className="p-3">Validation Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-sandstone">
                {results.map((res) => (
                  <tr key={res.rowIndex} className={res.isValid ? '' : 'bg-red-50/50'}>
                    <td className="p-3 font-mono font-bold text-muted">{res.rowIndex}</td>
                    <td className="p-3">
                      {res.isValid ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          VALID
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-terracotta text-parchment font-bold rounded text-[10px]">
                          INVALID
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-charcoal">{res.row.name || '—'}</td>
                    <td className="p-3">{res.row.category || '—'}</td>
                    <td className="p-3 font-mono font-bold text-terracotta">
                      {res.row.price ? `Rs. ${res.row.price.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-3">
                      {res.row.stock ? (
                        <span className="text-emerald-800 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-terracotta font-semibold">Out of Stock</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {Array.isArray(res.row.images) && res.row.images.length > 0 ? (
                        res.row.images[0].includes('drive.google.com') ? (
                          <span className="px-2 py-0.5 bg-lapis/10 text-lapis font-semibold rounded text-[10px] flex items-center gap-1 w-max">
                            📁 Google Drive Folder (Auto-Sync)
                          </span>
                        ) : (
                          `${res.row.images.length} URLs`
                        )
                      ) : (
                        'Default Asset'
                      )}
                    </td>
                    <td className="p-3 text-red-600 text-[11px]">
                      {res.errors.length > 0 ? res.errors.join('; ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ingestion Progress Modal */}
      <IngestionProgressModal
        isOpen={ingestionModalOpen}
        totalItems={validRows.length}
        currentIndex={currentIndex}
        currentProductName={currentProductName}
        isFinished={isFinished}
        results={ingestionResults}
        onClose={handleCloseModal}
      />
    </div>
  );
}


