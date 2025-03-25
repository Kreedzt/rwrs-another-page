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
  const [isMultiSelect, setIsMultiSelect] = useState(false);

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
    let newFilters: string[];
    
    if (isMultiSelect) {
      // 多选模式：切换选中状态
      newFilters = quickFilters.includes(filterId)
        ? quickFilters.filter(id => id !== filterId)
        : [...quickFilters, filterId];
    } else {
      // 单选模式：直接替换
      newFilters = quickFilters.includes(filterId) ? [] : [filterId];
    }
    
    setQuickFilters(newFilters);
    updateSearchParams(searchQuery, newFilters);

    setPagination({
      pageIndex: 0,
      pageSize,
    });
  }, [quickFilters, searchQuery, updateSearchParams, isMultiSelect]);

  const handleMultiSelectChange = useCallback((checked: boolean) => {
    setIsMultiSelect(checked);
    // 切换到单选模式时，如果当前有多个选中项，只保留最后一个
    if (!checked && quickFilters.length > 1) {
      const lastFilter = quickFilters[quickFilters.length - 1];
      setQuickFilters([lastFilter]);
      updateSearchParams(searchQuery, [lastFilter]);
    }
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
    isMultiSelect,
    setSearchQuery,
    handleSearch,
    handleReset,
    handleQuickFilter,
    handleMultiSelectChange,
    updateSearchParams,
    getCombinedFilterValue
  };
}