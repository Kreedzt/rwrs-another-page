import React, { useCallback, useState, useEffect } from 'preact/compat';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { DataTableService } from '@/services/data-table.service';
import { useToast } from '@/hooks/use-toast';
import { TableHeader } from './components/TableHeader';
import { useTableSearch } from './hooks/useTableSearch';
import { MobileDataList } from './components/MobileDataList';
import { PCDataTable } from './components/PCDataTable';
import { MapOrderView } from './components/MapOrderView';
import { DEFAULT_PAGE_SIZE, INITIAL_COLUMNS_VISIBILITY } from './constants';
import { PaginationState } from '@tanstack/react-table';
import { getInitialViewMode } from './hooks/useTableSearch';

const Home: React.FC = () => {
  const intl = useIntl();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'map'>(
    getInitialViewMode(),
  );
  const { toast } = useToast();
  const {
    searchQuery,
    quickFilters,
    isMultiSelect,
    handleSearch,
    handleReset,
    handleQuickFilter,
    handleMultiSelectChange,
    updateSearchParams,
    getCombinedFilterValue,
  } = useTableSearch();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(INITIAL_COLUMNS_VISIBILITY);

  const {
    data: tableData = [],
    isLoading,
    mutate,
  } = useSWR('/api/data-table', () => DataTableService.listAll({ timeout: 15000 }), {
    onSuccess: (data) => {
      const now = new Date().toLocaleTimeString();
      toast({
        title: intl.formatMessage({ id: 'app.toast.refreshSuccess.title', defaultMessage: 'Refresh server list success' }),
        description: intl.formatMessage(
          { id: 'app.toast.refreshSuccess.description', defaultMessage: 'Data fetched successfully on {time}. Found {count} servers.' },
          { time: now, count: data.length }
        ),
      });
    },
    onError: (err) => {
      console.error('SWR fetch error:', err);
      toast({
        title: intl.formatMessage({ id: 'app.toast.refreshFailed.title', defaultMessage: 'Refresh server list failed' }),
        description: intl.formatMessage(
          { id: 'app.toast.refreshFailed.description', defaultMessage: 'Request timed out or failed: {error}' },
          { error: err.message || '' }
        ),
        variant: 'destructive',
      });
    },
    refreshInterval: autoRefresh ? 10000 : 0,
    // Don't block UI during refresh
    revalidateOnFocus: false,
    // Reduce deduping interval to allow more frequent manual refreshes
    dedupingInterval: 2000,
    // Continue showing stale data while revalidating
    keepPreviousData: true,
    // Don't retry on error for automatic refreshes (we'll handle manual retries)
    shouldRetryOnError: false,
    // Ensure we can always manually refresh even after errors
    errorRetryCount: 0,
  });

  // Cleanup unnecessary DOM nodes when component unmounts
  useEffect(() => {
    return () => {
      // Force cleanup of any lingering DOM nodes
      tableData.length = 0;
    };
  }, []);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(e.currentTarget.value, setPagination, DEFAULT_PAGE_SIZE);
    },
    [handleSearch],
  );

  const onReset = useCallback(() => {
    handleReset(setPagination, DEFAULT_PAGE_SIZE);
  }, [handleReset]);

  const onRefresh = useCallback(() => {
    toast({
      title: intl.formatMessage({ id: 'app.toast.refreshing.title', defaultMessage: 'Refreshing server list' }),
      description: intl.formatMessage({ id: 'app.toast.refreshing.description', defaultMessage: 'Please wait while we fetch the latest data...' }),
    });

    // Force a new request by providing a custom fetcher that bypasses SWR cache
    mutate(
      // Force refetch by providing a custom fetcher that will always run
      async () => {
        // Clear any previous errors
        console.log('Manually triggering refresh...');
        // Always fetch fresh data, bypassing any cache or error state
        return await DataTableService.listAll({ timeout: 15000 });
      },
      {
        // Don't revalidate again after this manual trigger
        revalidate: false,
        // Force a refetch even if there was an error
        throwOnError: false,
      }
    );

    handleReset(setPagination, DEFAULT_PAGE_SIZE);
  }, [mutate, handleReset, toast]);

  const onQuickFilter = useCallback(
    (filterId: string) => {
      handleQuickFilter(filterId, setPagination, DEFAULT_PAGE_SIZE);
    },
    [handleQuickFilter],
  );

  const onColumnToggle = useCallback((columnId: string, checked: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: checked,
    }));
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const newMode = prev === 'table' ? 'map' : 'table';
      updateSearchParams(searchQuery, quickFilters, newMode);
      return newMode;
    });
  }, [searchQuery, quickFilters, updateSearchParams]);

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4">
        <TableHeader
          searchQuery={searchQuery}
          quickFilters={quickFilters}
          isLoading={isLoading}
          onSearch={onSearch}
          onReset={onReset}
          onRefresh={onRefresh}
          onQuickFilter={onQuickFilter}
          autoRefresh={autoRefresh}
          onAutoRefreshChange={setAutoRefresh}
          columnVisibility={columnVisibility}
          onColumnToggle={onColumnToggle}
          viewMode={viewMode}
          onViewModeToggle={toggleViewMode}
          isMultiSelect={isMultiSelect}
          onMultiSelectChange={handleMultiSelectChange}
        />

        {viewMode === 'table' ? (
          <>
            <PCDataTable
              data={tableData}
              isLoading={isLoading}
              searchQuery={getCombinedFilterValue()}
              pagination={pagination}
              setPagination={setPagination}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
            />

            <MobileDataList
              data={tableData}
              isLoading={isLoading}
              searchQuery={getCombinedFilterValue()}
              onRefresh={onRefresh}
            />
          </>
        ) : (
          <MapOrderView
            data={tableData}
            isLoading={isLoading}
            activeFilters={quickFilters}
            searchQuery={getCombinedFilterValue().searchQuery}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
