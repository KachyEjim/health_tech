// src/app/tests/components/FileList.tsx

'use client';

import {
  DocumentIcon,
  DocumentTextIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { getFileSize } from '../utils/fileUtils';

type FileListProps = {
  existingFiles: string[];
  files: File[];
  onRemoveFile: (index: number) => void;
  onRemoveExistingFile: (path: string) => void;
};

const FileList: React.FC<FileListProps> = ({
  existingFiles,
  files,
  onRemoveFile,
  onRemoveExistingFile,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Attached Files</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {existingFiles.map((path, index) => {
          const fileName = path.split('/').pop() || '';
          return (
            <div
              key={`existing-${index}`}
              className="flex items-center justify-between bg-white p-2.5 rounded-md border border-gray-200"
            >
              <div className="flex items-center truncate">
                <DocumentTextIcon className="h-5 w-5 text-emerald-600 mr-2" />
                <span className="text-sm truncate">{fileName}</span>
              </div>
              <div className="flex items-center">
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-800 p-1.5 rounded-full transition-colors"
                  title="View file"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={() => onRemoveExistingFile(path)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-full transition-colors"
                  title="Remove file"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
        {files.map((file, index) => (
          <div
            key={`new-${index}`}
            className="flex items-center justify-between bg-white p-2.5 rounded-md border border-gray-200"
          >
            <div className="flex items-center truncate">
              <DocumentIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div className="truncate">
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {getFileSize(file.size)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemoveFile(index)}
              className="text-red-500 hover:text-red-700 p-1.5 rounded-full transition-colors"
              title="Remove file"
            >
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
