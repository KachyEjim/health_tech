// src/app/tests/page.tsx

'use client';

import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useState } from 'react';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import TestDetailsModal from './components/TestDetailsModal';
import TestForm, { DiagnosticTest } from './components/TestForm';
import TestsTable from './components/TestsTable';
import ToastContainer, { ToastMessage } from './components/ToastContainer';

const TestsPage = () => {
  const [tests, setTests] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<DiagnosticTest | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewTest, setViewTest] = useState<DiagnosticTest | null>(null);

  // New state variables for delete confirmation and toasts
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    testId: string;
    testName: string;
  }>({
    isOpen: false,
    testId: '',
    testName: '',
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchTests = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('/api/tests');
      if (!res.ok) {
        console.log('Error fetching tests1:', error);

        throw new Error(`Failed to fetch tests: ${res.status}`);
      }
      const data = await res.json();
      setTests(data);
    } catch (error) {
      console.log('Error fetching tests2:', error);
      setError('Failed to load test results. Please try again later.');
      addToast('Failed to load test results. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const confirmDelete = (test: DiagnosticTest) => {
    setDeleteConfirmation({
      isOpen: true,
      testId: test.id || '',
      testName: test.patientName,
    });
  };

  const handleDeleteById = (id: string) => {
    const testToDelete = tests.find((test) => test.id === id);
    if (testToDelete) {
      confirmDelete(testToDelete);
    }
  };

  const handleDelete = async () => {
    const { testId } = deleteConfirmation;
    try {
      setDeletingId(testId);
      const res = await fetch(`/api/tests/${testId}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Failed to delete: ${res.status}`);
      }
      await fetchTests();
      addToast('Test deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting test:', error);
      addToast('Failed to delete test. Please try again.', 'error');
    } finally {
      setDeletingId(null);
      setDeleteConfirmation({ isOpen: false, testId: '', testName: '' });
    }
  };

  const handleEdit = (test: DiagnosticTest) => {
    setSelectedTest(test);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedTest(null);
    setShowForm(true);
  };

  const handleView = (test: DiagnosticTest) => {
    setViewTest(test);
  };

  const handleFormClose = async (wasSubmitted: boolean = false) => {
    setShowForm(false);
    if (wasSubmitted) {
      await fetchTests();
      addToast(
        selectedTest
          ? 'Test updated successfully'
          : 'New test added successfully',
        'success',
      );
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-800">
          Diagnostic Test Results
        </h1>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg hover:bg-emerald-700 active:bg-emerald-800 shadow-md flex items-center transition-colors w-full sm:w-auto justify-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Test
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading test results...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">No test results available.</p>
          <button
            onClick={handleAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Add Your First Test
          </button>
        </div>
      ) : (
        <TestsTable
          tests={tests}
          onEdit={handleEdit}
          onDelete={handleDeleteById}
          onView={handleView}
          deletingId={deletingId}
        />
      )}

      {showForm && (
        <TestForm
          test={selectedTest}
          onClose={() => handleFormClose(false)}
          onSubmitSuccess={() => handleFormClose(true)}
        />
      )}

      {viewTest && (
        <TestDetailsModal
          test={viewTest}
          onClose={() => setViewTest(null)}
          onEdit={handleEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, testId: '', testName: '' })
        }
        onConfirm={handleDelete}
        testName={deleteConfirmation.testName}
        isDeleting={deletingId === deleteConfirmation.testId}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default TestsPage;
