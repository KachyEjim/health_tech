// src/app/tests/components/TestsTable.tsx

'use client';

import { DocumentIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { DiagnosticTest } from './TestForm';

type TestsTableProps = {
  tests: DiagnosticTest[];
  onEdit: (test: DiagnosticTest) => void;
  onDelete: (id: string) => void;
  onView: (test: DiagnosticTest) => void;
  deletingId: string | null;
};

const TestsTable: React.FC<TestsTableProps> = ({
  tests,
  onEdit,
  onDelete,
  onView,
  deletingId,
}) => {
  const getFileCount = (test: DiagnosticTest): number => {
    if (!test.result || !test.result.files) return 0;
    return Array.isArray(test.result.files) ? test.result.files.length : 1;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Test Type
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider hidden md:table-cell">
                Test Date
              </th>
              <th className="py-3.5 px-4 text-center text-xs font-semibold text-emerald-800 uppercase tracking-wider hidden sm:table-cell">
                Files
              </th>
              <th className="py-3.5 px-4 text-center text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm font-medium text-gray-800">
                  {test.patientName}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                  {test.testType}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700 hidden md:table-cell">
                  {new Date(test.testDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-center hidden sm:table-cell">
                  {getFileCount(test) > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <DocumentIcon className="h-3.5 w-3.5 mr-1" />
                      {getFileCount(test)}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">None</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onView(test)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-full transition-colors"
                      title="View Details"
                    >
                      {/* Use your preferred view icon */}
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
                    </button>
                    <button
                      onClick={() => onEdit(test)}
                      className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-1.5 rounded-full transition-colors"
                      title="Edit Test"
                    >
                      {/* Use a pencil icon */}
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
                          d="M15.232 5.232l3.536 3.536M9 11l6 6H3V5h6v6z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => test.id && onDelete(test.id)}
                      disabled={deletingId === test.id}
                      className={`p-1.5 rounded-full transition-colors ${
                        deletingId === test.id
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                      }`}
                      title="Delete Test"
                    >
                      {deletingId === test.id ? (
                        <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-gray-300 animate-spin"></div>
                      ) : (
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H8V5a2 2 0 012-2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestsTable;
