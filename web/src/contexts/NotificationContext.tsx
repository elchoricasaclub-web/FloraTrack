import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'critical';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface NotificationContextProps {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'> & { id?: string }) => {
    const id = toast.id || Math.random().toString(36).substring(2, 9);
    
    setToasts((prev) => {
      // Prevent duplicates if an id is provided
      if (prev.some(t => t.id === id)) {
        return prev;
      }
      return [...prev, { ...toast, id }];
    });
    
    // Auto remove after 5 seconds automatically
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
