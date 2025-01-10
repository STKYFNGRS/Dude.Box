import { readFileContent } from '../hooks/useFileUpload';

export const processFiles = async (files: File[]) => {
  const processedFiles = await Promise.all(
    files.map(async (file) => {
      const content = await readFileContent(file);
      return {
        name: file.name,
        content
      };
    })
  );
  
  return processedFiles;
};

export const validateFiles = (
  files: File[], 
  maxSize = 10 * 1024 * 1024,
  acceptedTypes = ['text/csv', 'application/json', 'text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
) => {
  const errors: string[] = [];
  
  files.forEach(file => {
    if (file.size > maxSize) {
      errors.push(`File ${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`);
    }
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not supported for ${file.name}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};