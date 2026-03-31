import { useEffect, useRef, useCallback } from 'react';
import { useBatch } from '../context/BatchContext';
import { getBatchStatus } from '../api/batchApi';

export function useBatchPolling(batchId) {
  const { state, dispatch } = useBatch();
  const pollingRef = useRef(null);

  const poll = useCallback(async () => {
    if (!batchId) return;

    try {
      const data = await getBatchStatus(batchId);
      
      const allDone = data.files.every(
        (f) => f.status === 'success' || f.status === 'failed'
      );

      dispatch({ type: 'UPDATE_STATUS', payload: { files: data.files } });

      if (allDone) {
        clearInterval(pollingRef.current);
        dispatch({ type: 'STOP_POLLING' });
      }
    } catch (err) {
      console.error('Polling error:', err);
      dispatch({ type: 'POLLING_ERROR', payload: err.message });
    }
  }, [batchId, dispatch]);

  useEffect(() => {
    if (batchId && state.isPolling) {
      poll(); // Immediate first call
      pollingRef.current = setInterval(poll, 2000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [batchId, state.isPolling, poll]);

  return {
    files: state.files,
    isComplete: state.isComplete,
    error: state.error,
  };
}
