'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { CRAFT_MATERIALS } from '@/lib/constants/taxonomy';
import { updateProduct, SingleProductPayload } from '@/actions/admin-products';
import { Pencil, X, UploadCloud, Folder, RefreshCw, CheckCircle2, AlertCircle, Sparkles, Trash2 } from 'lucide-react';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export function EditProductModal({ product, isOpen, onClose, onSuccess }: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(CRAFT_MATERIALS[0]);
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [colors, setColors] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [inStock, setInStock] = useState(true);
  const [driveFolderLink, setDriveFolderLink] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<{ name: string; type: string; base64: string; preview?: string; sizeKb?: number }[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category?.name || CRAFT_MATERIALS[0]);
      setPrice(product.price ? product.price.toString() : '');
      setWeight(product.weight ? product.weight.toString() : '');
      setSize(product.size || '');
      setColors(product.colors || '');
      setShortDescription(product.short_description || '');
      setLongDescription(product.long_description || '');
      setInStock(product.in_stock ?? true);
      setDriveFolderLink('');
      setExistingImages(product.images || []);
      setNewImageFiles([]);
      setMessage(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const compressImage = (file: File, maxWidth = 1200, quality = 0.82): Promise<{ name: string; type: string; base64: string; preview: string; sizeKb: number }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          const sizeKb = Math.round((compressedBase64.length * 3) / 4 / 1024);

          resolve({
            name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
            type: 'image/jpeg',
            base64: compressedBase64,
            preview: compressedBase64,
            sizeKb,
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileDrop = async (files: FileList | null) => {
    if (!files) return;
    const newFiles = await Promise.all(Array.from(files).map((file) => compressImage(file)));
    setNewImageFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: SingleProductPayload = {
      name: name.trim(),
      category: category.trim(),
      price: parseFloat(price) || 0,
      weight: parseFloat(weight) || 0,
      size: size.trim(),
      colors: colors.trim(),
      short_description: shortDescription.trim(),
      long_description: longDescription.trim(),
      in_stock: inStock,
      driveFolderLink: driveFolderLink.trim(),
      imageUrls: existingImages,
      base64Images: newImageFiles,
    };

    const res = await updateProduct(product.id, payload);
    setLoading(false);

    if (res.success) {
      const msg = `✓ Product "${name}" updated successfully!`;
      setMessage({ type: 'success', text: msg });
      if (onSuccess) onSuccess(msg);
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update product.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-parchment w-full max-w-2xl rounded-2xl border-2 border-border shadow-craft-lg overflow-hidden animate-in fade-in duration-200 my-8">
        {/* Modal Header */}
        <div className="bg-sandstone px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-lapis" />
            <h3 className="font-serif text-xl font-bold text-charcoal">
              Edit Product Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-muted hover:text-charcoal hover:bg-parchment rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {message && (
            <div
              className={`p-3 rounded-md flex items-center gap-2 font-medium ${
                message.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Name & Craft Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-charcoal mb-1">
                Product Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">
                Craft Category <span className="text-terracotta">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal cursor-pointer font-medium"
              >
                {CRAFT_MATERIALS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Weight, Size, Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-semibold text-charcoal mb-1">
                Price (PKR) <span className="text-terracotta">*</span>
              </label>
              <input
                type="number"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Dimensions / Size</label>
              <input
                type="text"
                placeholder='e.g. 12" x 6"'
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">Colors</label>
              <input
                type="text"
                placeholder="e.g. Blue, Brass Gold"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-charcoal mb-1">
                Short Description (under product thumbnail)
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>

            <div>
              <label className="block font-semibold text-charcoal mb-1">
                Long Description (Detailed Craft Heritage)
              </label>
              <textarea
                rows={3}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="w-full px-3 py-2 bg-sandstone border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal"
              />
            </div>
          </div>

          {/* Stock Toggle */}
          <div className="flex items-center justify-between p-3 bg-sandstone rounded-lg border border-border">
            <span className="font-semibold text-charcoal">Inventory Stock Status:</span>
            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${
                inStock
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
              }`}
            >
              {inStock ? '✓ In Stock' : '✕ Out of Stock'}
            </button>
          </div>

          {/* Existing Images Gallery */}
          {existingImages.length > 0 && (
            <div className="p-4 bg-sandstone rounded-lg border border-border space-y-2">
              <label className="block font-semibold text-charcoal">
                Current Product Images ({existingImages.length})
              </label>
              <div className="flex flex-wrap gap-3 pt-1">
                {existingImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative group w-16 h-16 bg-parchment rounded-lg border border-border overflow-hidden shadow-xs">
                    <img src={imgUrl} alt="Product image" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Option A: Google Drive Link */}
          <div className="p-4 bg-sandstone rounded-lg border border-border space-y-2">
            <label className="block font-semibold text-charcoal flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-lapis" /> Add More via Google Drive Public Folder Link
            </label>
            <input
              type="text"
              placeholder="https://drive.google.com/drive/folders/1A2B3C..."
              value={driveFolderLink}
              onChange={(e) => setDriveFolderLink(e.target.value)}
              className="w-full px-3 py-2 bg-parchment border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-brass text-charcoal font-mono text-[11px]"
            />
          </div>

          {/* Image Option B: Direct Image Dropzone */}
          <div className="p-4 bg-sandstone rounded-lg border border-border space-y-2">
            <label className="block font-semibold text-charcoal flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-terracotta" /> Add Local Image Files
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileDrop(e.dataTransfer.files);
              }}
              className="border border-dashed border-border rounded-md p-4 text-center bg-parchment cursor-pointer"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileDrop(e.target.files)}
                className="hidden"
                id="edit-modal-image-file-input"
              />
              <label htmlFor="edit-modal-image-file-input" className="cursor-pointer text-muted hover:text-charcoal">
                Drag & drop image files or <span className="text-lapis font-semibold underline">browse</span>
              </label>
            </div>

            {newImageFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal">
                  <span>New Images to Upload ({newImageFiles.length})</span>
                  <span className="text-muted font-mono text-[10px]">
                    Payload size: {newImageFiles.reduce((acc, curr) => acc + (curr.sizeKb || 0), 0)} KB
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {newImageFiles.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group bg-parchment border border-border p-2 rounded-lg flex items-center gap-2 shadow-xs"
                    >
                      <img
                        src={img.preview || img.base64}
                        alt={img.name}
                        className="w-12 h-12 object-cover rounded-md border border-border shrink-0 bg-sandstone"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] text-charcoal truncate font-medium">{img.name}</p>
                        {img.sizeKb && (
                          <span className="inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-semibold rounded mt-0.5">
                            {img.sizeKb} KB
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-sandstone hover:bg-chiseled border border-border text-charcoal font-semibold rounded-md transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-lapis hover:bg-lapis/90 text-parchment font-semibold rounded-md transition-colors flex items-center gap-2 shadow-craft-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-brass" /> Saving Changes...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-brass" /> Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
