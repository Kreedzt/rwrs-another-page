import { useCallback, useState } from 'preact/compat';
import { PaginationState } from '@tanstack/react-table';

export const getInitialSearchQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') || '';
};

export const getInitialQuickFilters = () => {
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('quickFilters');
  return filterParam ? filterParam.split(',') : [];
};

export function useTableSearch() {
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
  const [quickFilters, setQuickFilters] = useState<string[]>(getInitialQuickFilters());

  const updateSearchParams = useCallback((query: string, filters: string[]) => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    
    if (filters.length > 0) {
      params.set('quickFilters', filters.join(','));
    } else {
      params.delete('quickFilters');
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
    updateSearchParams(value, quickFilters);

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [updateSearchParams, quickFilters]);

  const handleReset = useCallback((
    setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void,
    pageSize: number
  ) => {
    setSearchQuery('');
    setQuickFilters([]);
    updateSearchParams('', []);

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [updateSearchParams]);

  const handleQuickFilter = useCallback((
    filterId: string,
    setPagination: (value: PaginationState | ((prev: PaginationState) => PaginationState)) => void,
    pageSize: number
  ) => {
    // Toggle the filter - add if not present, remove if present
    const newFilters = quickFilters.includes(filterId)
      ? quickFilters.filter(id => id !== filterId)
      : [...quickFilters, filterId];
    
    setQuickFilters(newFilters);
    updateSearchParams(searchQuery, newFilters);

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [quickFilters, searchQuery, updateSearchParams]);

  const getCombinedFilterValue = useCallback(() => {
    return {
      searchQuery,
      quickFilters
    };
  }, [searchQuery, quickFilters]);

  return {
    searchQuery,
    quickFilters,
    setSearchQuery,
    handleSearch,
    handleReset,
    handleQuickFilter,
    updateSearchParams,
    getCombinedFilterValue
  };
}