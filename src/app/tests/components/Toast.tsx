'use client';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
};

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 shadow-lg flex items-center ${getToastStyles()}`}
    >
      <div className="flex-shrink-0 mr-3">{getIcon()}</div>
      <div className="flex-1">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        title="Close"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;
