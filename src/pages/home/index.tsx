import React, { useCallback, useState } from 'preact/compat';
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

const Home: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const { toast } = useToast();
  const {
    searchQuery,
    quickFilters,
    handleSearch,
    handleReset,
    handleQuickFilter,
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
  } = useSWR('/api/data-table', DataTableService.listAll, {
    onSuccess: () => {
      const now = new Date().toLocaleTimeString();
      toast({
        title: 'Refresh server list success',
        description: `Data fetched successfully on ${now}`,
      });
    },
    onError: (err) => {
      toast({
        title: 'Refresh server list failed',
        description: err.message,
      });
    },
    refreshInterval: autoRefresh ? 10000 : 0,
  });

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
    mutate();
    handleReset(setPagination, DEFAULT_PAGE_SIZE);
  }, [mutate, handleReset]);

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
    setViewMode((prev) => (prev === 'table' ? 'map' : 'table'));
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
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
    </div>
  );
};

export default Home;
