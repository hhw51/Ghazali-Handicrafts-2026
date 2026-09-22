'use client';

import { useState } from 'react';
import { parseExcelBuffer, ParsedRowResult } from '@/lib/parsers/excel';
import { bulkUpsertProducts } from '@/actions/admin-products';
import { SheetProductRow } from '@/lib/validations/product';
import { FileSpreadsheet, UploadCloud, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [results, setResults] = useState<ParsedRowResult[]>([]);
  const [validRows, setValidRows] = useState<SheetProductRow[]>([]);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleConfirmImport = async () => {
    if (validRows.length === 0) return;

    setUploading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const res = await bulkUpsertProducts(validRows);
    setUploading(false);

    if (res.success) {
      setSuccessMessage(`✓ Successfully ingested ${res.insertedCount} products into Supabase catalog!`);
      setFile(null);
      setResults([]);
      setValidRows([]);
    } else {
      setErrorMessage(res.error || 'Failed to bulk upsert products.');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">
          Bulk Google Sheet / Excel Ingestion
        </h1>
        <p className="text-xs text-muted mt-1">
          Upload `.xlsx` or `.csv` files to parse, validate, and batch upsert products into Supabase.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
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
    </div>
  );
}
