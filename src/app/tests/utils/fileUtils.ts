// src/app/tests/utils/fileUtils.ts

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
    return 'image';
  } else if (['pdf'].includes(extension || '')) {
    return 'pdf';
  } else if (['doc', 'docx'].includes(extension || '')) {
    return 'word';
  } else {
    return 'generic';
  }
};

export const getFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};
