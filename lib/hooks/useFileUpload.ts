import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  onUpload?: (files: File[]) => void;
  maxSize?: number; // in bytes
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const useFileUpload = ({
  onUpload,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 5,
  acceptedTypes = ['text/csv', 'application/json', 'text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}: UseFileUploadOptions = {}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setError(null);

    // Validate number of files
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file types and sizes
    const invalidFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
        return true;
      }
      if (!acceptedTypes.includes(file.type)) {
        setError(`File type ${file.type} not supported`);
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      return;
    }

    // Process valid files
    const processedFiles = await Promise.all(
      newFiles.map(async (file) => {
        return file;
      })
    );

    const updatedFiles = [...files, ...processedFiles];
    setFiles(updatedFiles);
    onUpload?.(updatedFiles);
  }, [files, maxSize, maxFiles, acceptedTypes, onUpload]);

  const removeFile = useCallback((fileName: string) => {
    const updatedFiles = files.filter(f => f.name !== fileName);
    setFiles(updatedFiles);
    onUpload?.(updatedFiles);
  }, [files, onUpload]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    onUpload?.([]);
  }, [onUpload]);

  return {
    files,
    error,
    handleFiles,
    removeFile,
    clearFiles
  };
};

// Utility function to read file content
export const readFileContent = (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string | ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};