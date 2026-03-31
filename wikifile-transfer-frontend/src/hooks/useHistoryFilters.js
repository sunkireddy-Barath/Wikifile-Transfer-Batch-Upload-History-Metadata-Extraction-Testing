import { useCallback, useEffect } from 'react';
import { useHistory } from '../context/HistoryContext';
import { getHistory } from '../api/historyApi';

export function useHistoryFilters() {
  const { state, dispatch } = useHistory();

  const fetchRecords = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getHistory({
        page: state.page,
        per_page: state.perPage,
        status: state.filters.status,
        source_wiki: state.filters.sourceWiki,
        target_wiki: state.filters.targetWiki,
        start_date: state.filters.startDate,
        end_date: state.filters.endDate,
      });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, [state.page, state.perPage, state.filters, dispatch]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const setFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const setPage = (page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  };

  return {
    records: state.records,
    total: state.total,
    page: state.page,
    stats: state.stats,
    filters: state.filters,
    loading: state.loading,
    error: state.error,
    setFilters,
    setPage,
    refresh: fetchRecords,
  };
}
