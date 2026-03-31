import React, { createContext, useReducer, useContext } from 'react';

const BatchContext = createContext();

const initialState = {
  batchId: null,
  files: [],
  isComplete: false,
  error: null,
  isPolling: false,
};

function batchReducer(state, action) {
  switch (action.type) {
    case 'START_BATCH':
      return {
        ...state,
        batchId: action.payload.batchId,
        files: action.payload.files.map(title => ({ title, status: 'queued', progress: 0 })),
        isComplete: false,
        isPolling: true,
        error: null,
      };
    case 'UPDATE_STATUS':
      // Map API response to our local state
      const updatedFiles = action.payload.files.map(f => ({
        title: f.title,
        status: f.status,
        target_url: f.target_url,
        error: f.error,
        categories_localized: f.categories_localized
      }));
      
      const allDone = updatedFiles.every(f => f.status === 'success' || f.status === 'failed');
      
      return {
        ...state,
        files: updatedFiles,
        isComplete: allDone,
        isPolling: !allDone,
      };
    case 'POLLING_ERROR':
      return { ...state, error: action.payload };
    case 'STOP_POLLING':
      return { ...state, isPolling: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const BatchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(batchReducer, initialState);
  return (
    <BatchContext.Provider value={{ state, dispatch }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => useContext(BatchContext);
