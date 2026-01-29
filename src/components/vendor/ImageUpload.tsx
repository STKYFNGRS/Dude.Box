"use client";

import { useState } from "react";
import { UploadButton, UploadDropzone } from "@uploadthing/react";
import Image from "next/image";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface ImageUploadProps {
  endpoint: "storeLogo" | "storeBanner";
  value?: string;
  onChange: (url: string) => void;
  label: string;
  description: string;
  previewHeight?: string;
}

export function ImageUpload({
  endpoint,
  value,
  onChange,
  label,
  description,
  previewHeight = "h-48"
}: ImageUploadProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <p className="text-xs text-muted-foreground mb-4">{description}</p>
      </div>

      {/* Preview */}
      {value && (
        <div className={`relative w-full ${previewHeight} bg-border/20 rounded-lg overflow-hidden mb-4`}>
          <Image
            src={value}
            alt="Upload preview"
            fill
            className={endpoint === "storeLogo" ? "object-contain p-4" : "object-cover"}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload zone - only show if no image */}
      {!value && (
        <div className="space-y-4">
          {/* Dropzone */}
          <UploadDropzone<OurFileRouter, typeof endpoint>
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                onChange(res[0].url);
                setUploadError(null);
                setIsUploading(false);
              }
            }}
            onUploadError={(error: Error) => {
              setUploadError(error.message);
              setIsUploading(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setUploadError(null);
            }}
            config={{
              mode: "auto"
            }}
            appearance={{
              container: "border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer",
              uploadIcon: "text-muted-foreground",
              label: "text-sm text-foreground",
              allowedContent: "text-xs text-muted-foreground",
              button: "solid-button rounded-full px-4 py-2 text-xs uppercase tracking-wider"
            }}
          />

          {/* Alternative: Upload Button */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">Or use the button:</p>
            <UploadButton<OurFileRouter, typeof endpoint>
              endpoint={endpoint}
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  onChange(res[0].url);
                  setUploadError(null);
                  setIsUploading(false);
                }
              }}
              onUploadError={(error: Error) => {
                setUploadError(error.message);
                setIsUploading(false);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
                setUploadError(null);
              }}
              appearance={{
                button: "solid-button rounded-full px-6 py-2 text-xs uppercase tracking-wider",
                allowedContent: "text-xs text-muted-foreground mt-2"
              }}
            />
          </div>
        </div>
      )}

      {/* Upload status */}
      {isUploading && (
        <div className="text-sm text-blue-500 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Uploading...
        </div>
      )}

      {/* Error message */}
      {uploadError && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">
          {uploadError}
        </div>
      )}
    </div>
  );
}
