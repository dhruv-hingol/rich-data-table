import { useState, useRef, useCallback } from 'react';

export function useUndoableAction<T>(onExecute: (data: T) => void, timeoutMs: number = 5000) {
  const [pendingItem, setPendingItem] = useState<T | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAction = useCallback(
    (item: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setPendingItem(item);
      timerRef.current = setTimeout(() => {
        onExecute(item);
        setPendingItem(null);
        timerRef.current = null;
      }, timeoutMs);
    },
    [onExecute, timeoutMs]
  );

  const cancelAction = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPendingItem(null);
  }, []);

  return {
    pendingItem,
    triggerAction,
    cancelAction,
  };
}
