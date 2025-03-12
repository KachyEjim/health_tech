// src/app/tests/components/TestForm.tsx

'use client';

import {
  DocumentArrowUpIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  XMarkIcon as XIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import FileList from './FileList';

export type DiagnosticTest = {
  createdAt: string;
  id?: string;
  patientName: string;
  testType: string;
  result: {
    files?:
      | string[]
      | { name: string; path: string; type: string; size: number }[];
    value?: string | number;
  };
  testDate: string;
  notes: string;
};

type TestFormProps = {
  test?: DiagnosticTest | null;
  onClose: () => void;
  onSubmitSuccess?: () => void;
};

const TEST_TYPES = [
  'Blood Test',
  'Complete Blood Count (CBC)',
  'Metabolic Panel',
  'Lipid Panel',
  'Thyroid Function',
  'X-Ray',
  'MRI Scan',
  'CT Scan',
  'PET Scan',
  'Ultrasound',
  'ECG/EKG',
  'Endoscopy',
  'Colonoscopy',
  'Biopsy',
  'Urinalysis',
  'Genetic Testing',
  'Allergy Testing',
  'Pathology',
  'Stress Test',
  'Mammogram',
  'Other',
];

const TestForm: React.FC<TestFormProps> = ({
  test,
  onClose,
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState<DiagnosticTest>({
    createdAt: new Date().toISOString(),
    id: test?.id,
    patientName: '',
    testType: '',
    result: { value: '' },
    testDate: '', // Initialize as empty string
    notes: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [customTestType, setCustomTestType] = useState<string>('');

  useEffect(() => {
    if (test) {
      const formattedTest = {
        ...test,
        // Only use existing date for editing, don't provide default
        testDate: test.testDate?.split('T')[0] || '',
        result: test.result || { value: '' },
      };

      setFormData(formattedTest);
      if (test.testType && !TEST_TYPES.includes(test.testType)) {
        setCustomTestType(test.testType);
      }

      if (test.result && test.result.files) {
        const filesArr = Array.isArray(test.result.files)
          ? test.result.files
          : [test.result.files];
        setExistingFiles(
          filesArr.map((file) => (typeof file === 'string' ? file : file.path)),
        );
      }
    }
  }, [test]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === 'result') {
      setFormData((prev) => ({
        ...prev,
        result: { ...prev.result, value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const acceptedFiles = droppedFiles.filter((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'].includes(ext || '');
      });

      if (acceptedFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeExistingFile = (path: string) => {
    setExistingFiles((prevFiles) => prevFiles.filter((file) => file !== path));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // All validation checks at the beginning
    if (!formData.testDate) {
      setError('Please select a test date');
      return;
    }

    if (!formData.patientName.trim()) {
      setError('Please enter a patient name');
      return;
    }

    if (formData.testType === 'Other' && !customTestType.trim()) {
      setError('Please enter a custom test type');
      return;
    }

    if (!formData.testType) {
      setError('Please select a test type');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      const finalTestType =
        formData.testType === 'Other' && customTestType
          ? customTestType
          : formData.testType;

      // Add essential fields individually
      formDataToSend.append('patientName', formData.patientName);
      formDataToSend.append('testType', finalTestType);
      formDataToSend.append('testDate', formData.testDate);

      // Add result value if present
      if (formData.result && formData.result.value) {
        formDataToSend.append('result.value', String(formData.result.value));
      } else {
        // Always include a result object, even if empty
        formDataToSend.append('result.value', '');
      }

      // Add notes if present
      if (formData.notes) {
        formDataToSend.append('notes', formData.notes);
      }

      // Handle existing files
      if (existingFiles.length > 0) {
        formDataToSend.append('existingFiles', JSON.stringify(existingFiles));
      }

      // Add new files
      files.forEach((file) => {
        formDataToSend.append('files', file);
      });

      const method = test ? 'PUT' : 'POST';
      const url = test ? `/api/tests/${test.id}` : '/api/tests';

      const res = await fetch(url, {
        method,
        body: formDataToSend,
      });

      // Get the response text first for debugging
      const responseText = await res.text();

      // Then parse it as JSON if possible
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        if (!res.ok) {
          throw new Error(`Server error: ${res.status} - ${responseText}`);
        }
      }

      if (!res.ok) {
        if (errorData && Array.isArray(errorData.error)) {
          // Extract just the validation messages for each field
          const errorMessages = errorData.error
            .map((err: { message: string }) => err.message)
            .join('\n');
          throw new Error(errorMessages);
        } else if (errorData && errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error(`Failed with status: ${res.status}`);
        }
      }

      // If we get here, the submission was successful
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 relative">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {test ? 'Edit Test Result' : 'Add New Test Result'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              title="Close"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                {error.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>
                    • {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Patient Info Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                    minLength={3}
                    placeholder="Enter patient name"
                  />
                  {formData.patientName &&
                    formData.patientName.length < 3 &&
                    formData.patientName.length > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        Patient name must be at least 3 characters
                      </p>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="testType"
                    value={formData.testType}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'Other') {
                        // When "Other" is selected, show the custom input field
                        setFormData((prev) => ({
                          ...prev,
                          testType: 'Other',
                        }));
                      } else {
                        // Regular test type selection
                        setFormData((prev) => ({
                          ...prev,
                          testType: value,
                        }));
                        setCustomTestType('');
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors appearance-none"
                    required
                    title="Select the type of diagnostic test"
                  >
                    <option value="">Select test type</option>
                    {TEST_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {/* Custom test type input that appears ONLY when "Other" is selected */}
                  {formData.testType === 'Other' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Test Type
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={customTestType}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomTestType(value);
                          // We keep 'Other' in the dropdown but store the actual value in customTestType
                          // and we'll use both values appropriately when submitting
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                        required
                        minLength={3}
                        placeholder="Specify the test type"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Test Results Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Test Details
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Results<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  name="result"
                  value={formData.result.value || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                  placeholder="Enter test findings and results"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Date<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                    title="Please select the date when the test was performed"
                    aria-label="Test Date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes ?? ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                    placeholder="Additional notes or comments (optional)"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <PaperClipIcon className="h-5 w-5 mr-2 text-emerald-600" />
                Attachments
              </h3>

              <div
                ref={dropzoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <DocumentArrowUpIcon className="h-10 w-10 text-emerald-500 mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports: JPG, PNG, PDF, DOC, DOCX (Max: 5MB per file)
                </p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  title="Upload test result files (images, PDFs, documents)"
                  aria-label="Upload test result files"
                />
              </div>

              {/* File List */}
              {(existingFiles.length > 0 || files.length > 0) && (
                <div className="mt-6">
                  <FileList
                    existingFiles={existingFiles}
                    files={files}
                    onRemoveFile={removeFile}
                    onRemoveExistingFile={removeExistingFile}
                  />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end pt-6 space-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 
                  active:bg-emerald-800 transition-colors flex items-center ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {test ? 'Updating...' : 'Saving...'}
                  </>
                ) : test ? (
                  'Update Test'
                ) : (
                  'Save Test'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestForm;
