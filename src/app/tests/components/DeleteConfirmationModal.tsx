'use client';

import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testName: string;
  isDeleting: boolean;
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  testName,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-red-800">
                Delete Test Result
              </h3>
              <p className="mt-1 text-sm text-red-600">
                This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the test result for{' '}
            <span className="font-semibold">{testName}</span>? This will
            permanently remove all associated data and files.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Test'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
