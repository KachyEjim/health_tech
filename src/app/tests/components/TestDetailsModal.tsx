// src/app/tests/components/TestDetailsModal.tsx

'use client';

import {
  ArrowDownTrayIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  DocumentIcon,
  InformationCircleIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { getFileIcon, getFileSize } from '../utils/fileUtils';
import { DiagnosticTest } from './TestForm';

type TestDetailsModalProps = {
  test: DiagnosticTest;
  onClose: () => void;
  onEdit: (test: DiagnosticTest) => void;
};

const TestDetailsModal: React.FC<TestDetailsModalProps> = ({
  test,
  onClose,
  onEdit,
}) => {
  const getFileCount = (test: DiagnosticTest): number => {
    if (!test.result || !test.result.files) return 0;
    return Array.isArray(test.result.files) ? test.result.files.length : 1;
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 relative">
        <div className="bg-blue-50 p-5 rounded-t-lg border-b border-blue-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-800 flex items-center">
              <InformationCircleIcon className="h-6 w-6 mr-2" />
              Test Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
              title="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Patient Name
              </h3>
              <p className="text-base font-medium text-gray-900">
                {test.patientName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Test Type
              </h3>
              <p className="text-base font-medium text-gray-900">
                {test.testType}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                Test Date
              </h3>
              <p className="text-base font-medium text-gray-900">
                {formatDate(test.testDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                <ClipboardDocumentListIcon className="h-4 w-4 mr-1 text-gray-400" />
                Created
              </h3>
              <p className="text-base font-medium text-gray-900">
                {formatDate(test.createdAt || test.testDate)}
              </p>
            </div>
          </div>
          {test.result && test.result.value && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Test Result
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {typeof test.result.value === 'string'
                    ? test.result.value
                    : String(test.result.value)}
                </p>
              </div>
            </div>
          )}
          {test.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {test.notes}
                </p>
              </div>
            </div>
          )}
          {test.result && test.result.files && getFileCount(test) > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Attached Files ({getFileCount(test)})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {(Array.isArray(test.result.files)
                  ? test.result.files
                  : [test.result.files]
                ).map((file, index) => {
                  const fileData =
                    typeof file === 'string'
                      ? {
                          name: file.split('/').pop() || 'file',
                          path: file,
                          type: '',
                          size: 0,
                        }
                      : file;
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        {getFileIcon(fileData.name) === 'image' ? (
                          <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-xs font-medium">
                              IMG
                            </span>
                          </div>
                        ) : getFileIcon(fileData.name) === 'pdf' ? (
                          <div className="h-10 w-10 bg-red-100 rounded-md flex items-center justify-center mr-3">
                            <span className="text-red-600 text-xs font-medium">
                              PDF
                            </span>
                          </div>
                        ) : (
                          <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                            <DocumentIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {fileData.name}
                          </p>
                          {fileData.size > 0 && (
                            <p className="text-xs text-gray-500">
                              {getFileSize(fileData.size)}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={fileData.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Download ${fileData.name}`}
                        className="ml-4 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={() => {
                onClose();
                onEdit(test);
              }}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-md hover:bg-emerald-100 transition-colors flex items-center mr-3"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailsModal;
