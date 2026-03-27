"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  bucket: string;
  currentUrl: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUploader({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  label = "Imagen",
  accept = "image/jpeg,image/png,image/webp",
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`El archivo excede ${maxSizeMB}MB.`);
        return;
      }

      setIsUploading(true);

      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setError("Error al subir la imagen. Intenta de nuevo.");
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUpload(urlData.publicUrl);
      setIsUploading(false);
    },
    [bucket, maxSizeMB, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>

      {currentUrl ? (
        <div className="relative inline-block">
          <Image
            src={currentUrl}
            alt={label}
            width={200}
            height={150}
            className="rounded-xl object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600"
            aria-label="Eliminar imagen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            dragOver
              ? "border-celeste bg-celeste/5"
              : "border-gray/20 hover:border-celeste/40 hover:bg-off-white"
          }`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-celeste" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray/30" />
              <p className="mt-2 text-sm text-gray">
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <p className="mt-1 text-xs text-gray/40">
                JPG, PNG o WebP. Máximo {maxSizeMB}MB.
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
