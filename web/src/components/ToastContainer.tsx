import React from 'react';
import { useNotification, ToastType } from '../contexts/NotificationContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto rounded-xl shadow-lg border p-4 flex items-start gap-3 w-80 animate-in slide-in-from-bottom-5 fade-in duration-300 ${
            toast.type === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-900' : 
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
            'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'critical' ? (
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : toast.type === 'warning' ? (
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : toast.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">{toast.title}</h4>
            <p className={`text-xs mt-1 ${
              toast.type === 'critical' ? 'text-rose-700' : 
              toast.type === 'warning' ? 'text-amber-700' : 
              toast.type === 'success' ? 'text-emerald-700' : 
              'text-blue-700'
            }`}>
              {toast.message}
            </p>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className={`shrink-0 p-1 rounded-full transition-colors ${
              toast.type === 'critical' ? 'hover:bg-rose-100 text-rose-500' : 
              toast.type === 'warning' ? 'hover:bg-amber-100 text-amber-500' :
              toast.type === 'success' ? 'hover:bg-emerald-100 text-emerald-500' :
              'hover:bg-blue-100 text-blue-500'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
