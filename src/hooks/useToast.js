import { useState } from 'react';

/**
 * useToast — global toast notification hook
 * Usage: const { toasts, addToast } = useToast();
 * addToast('Title', 'Message', 'success' | 'error' | 'info');
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return { toasts, addToast };
}
