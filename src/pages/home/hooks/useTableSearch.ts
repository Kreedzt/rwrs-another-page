import { useCallback, useState } from 'preact/compat';
import { PaginationState } from '@tanstack/react-table';

export const getInitialSearchQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') || '';
};

export function useTableSearch() {
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());

  const updateSearchParams = useCallback((query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }, []);

  const handleSearch = useCallback((
    value: string,
    setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void,
    pageSize: number
  ) => {
    setSearchQuery(value);
    updateSearchParams(value);

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [updateSearchParams]);

  const handleReset = useCallback((
    setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void,
    pageSize: number
  ) => {
    setSearchQuery('');
    updateSearchParams('');

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [updateSearchParams]);

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    handleReset,
    updateSearchParams
  };
}