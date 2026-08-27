"use client";

import { useState, useRef, useEffect } from "react";
import { uploadTradeImage } from "@/app/actions/upload";
import { ImagePlus, X, Loader2, Maximize2 } from "lucide-react";

interface TradeImageUploaderProps {
  tradeId: string;
  imageBeforeUrl?: string | null;
  imageAfterUrl?: string | null;
}

export function TradeImageUploader({ tradeId, imageBeforeUrl, imageAfterUrl }: TradeImageUploaderProps) {
  return (
    <div className="flex flex-col gap-6 mt-4">
      <ImageDropzone 
        tradeId={tradeId} 
        imageType="before" 
        label="Setup (Before)" 
        initialUrl={imageBeforeUrl} 
      />
      <ImageDropzone 
        tradeId={tradeId} 
        imageType="after" 
        label="Result (After)" 
        initialUrl={imageAfterUrl} 
      />
    </div>
  );
}

function ImageDropzone({ tradeId, imageType, label, initialUrl }: { tradeId: string, imageType: "before" | "after", label: string, initialUrl?: string | null }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, etc)");
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Optimistic UI preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tradeId", tradeId);
      formData.append("imageType", imageType);

      const result = await uploadTradeImage(formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Update with the actual remote URL once uploaded
      setPreviewUrl(result.imageUrl!);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
      setPreviewUrl(initialUrl || null); // Revert preview on failure
    } finally {
      setIsUploading(false);
    }
  };

  const processFileRef = useRef(processFile);
  useEffect(() => {
    processFileRef.current = processFile;
  }, [processFile]);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      if (!isHovered) return;
      const file = e.clipboardData?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        e.preventDefault();
        processFileRef.current(file);
      }
    };

    document.addEventListener("paste", handleGlobalPaste);
    return () => document.removeEventListener("paste", handleGlobalPaste);
  }, [isHovered]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const file = e.clipboardData.files?.[0];
    if (file && file.type.startsWith("image/")) {
      e.preventDefault();
      processFile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
      
      <div 
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative h-40 w-full rounded-xl overflow-hidden border-2 border-dashed transition-all flex items-center justify-center group focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5
          ${previewUrl ? "border-white/10" : "border-white/20 hover:border-white/30 cursor-pointer bg-white/[0.01] hover:bg-white/[0.03]"}
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
          ${isHovered && !previewUrl ? "border-amber-500/50 bg-amber-500/5" : ""}
        `}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <>
            <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="View Full Image">
                <Maximize2 className="w-5 h-5" />
              </a>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Replace Image"
              >
                <ImagePlus className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            ) : (
              <ImagePlus className="w-6 h-6 text-gray-500 group-hover:text-amber-500 transition-colors" />
            )}
            <span className="text-sm text-gray-500 group-hover:text-white transition-colors text-center px-4">
              {isUploading ? "Uploading..." : "Hover & press Ctrl+V, or Click to browse"}
            </span>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      {error && <span className="text-rose-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
