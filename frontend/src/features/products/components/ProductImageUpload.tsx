'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import Upload from 'lucide-react/dist/esm/icons/upload';
import X from 'lucide-react/dist/esm/icons/x';
import FileImage from 'lucide-react/dist/esm/icons/file-image';
import File from 'lucide-react/dist/esm/icons/file';

interface FileWithPreview extends File {
  preview?: string;
}

interface ProductImageUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

export function ProductImageUpload({
  value = [],
  onChange: _onChange,
  maxFiles = 5,
  maxSize = 5,
  className,
}: ProductImageUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
      // TODO: Implement actual upload and call onChange with URLs
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: maxFiles - files.length,
    maxSize: maxSize * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const removed = newFiles.splice(index, 1)[0];
      if (removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return newFiles;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Imágenes del Producto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer',
            'hover:border-primary/50 hover:bg-muted/50',
            isDragActive && 'border-primary bg-primary/5',
            isDragReject && 'border-destructive bg-destructive/5'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? 'Suelta las imágenes aquí'
                  : 'Arrastra y suelta imágenes aquí'}
              </p>
              <p className="text-xs text-muted-foreground">
                o haz clic para seleccionar archivos
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF hasta {maxSize}MB (máx. {maxFiles} archivos)
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                {/* Preview */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* URL Inputs for existing images */}
        {value.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Imágenes existentes</p>
            {value.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="flex-1 text-sm truncate text-muted-foreground">{url}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
