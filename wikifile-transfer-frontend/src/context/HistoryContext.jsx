import React, { createContext, useReducer, useContext } from 'react';

const HistoryContext = createContext();

const initialState = {
  records: [],
  total: 0,
  page: 1,
  perPage: 25,
  filters: {
    status: 'all', // 'all', 'success', 'failed', 'pending'
    sourceWiki: '',
    targetWiki: '',
    startDate: '',
    endDate: '',
  },
  stats: {
    totalTransfers: 0,
    successRate: 0,
    topTargetWiki: '',
  },
  loading: false,
  error: null,
};

function historyReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        records: action.payload.records,
        total: action.payload.total,
        page: action.payload.page,
        stats: action.payload.stats,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

export const HistoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  return (
    <HistoryContext.Provider value={{ state, dispatch }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);
