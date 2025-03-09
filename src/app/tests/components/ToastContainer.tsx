'use client';

import React from 'react';
import Toast, { ToastType } from './Toast';

export type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContainerProps = {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-6 z-50 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-slideIn">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
