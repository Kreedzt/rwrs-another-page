import React, { useCallback, useEffect, useState } from 'preact/compat';
import useSWR from 'swr';
import { DataTableService } from '@/services/data-table.service';
import { useToast } from '@/hooks/use-toast';
import { TableHeader } from './components/TableHeader';
import { TableStats } from './components/TableStats';
import { useTableSearch } from './hooks/useTableSearch';
import { useTableFilter } from './hooks/useTableFilter';
import { MobileDataList } from './components/MobileDataList';
import { PCDataTable } from './components/PCDataTable';
import { DEFAULT_PAGE_SIZE, INITIAL_COLUMNS_VISIBILITY } from './constants';
import { PaginationState } from '@tanstack/react-table';

const Home: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();
  const { searchQuery, handleSearch, handleReset } = useTableSearch();
  const { onFuzzyFilter } = useTableFilter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(INITIAL_COLUMNS_VISIBILITY);

  useEffect(() => {
    console.log('touch columnVisibility', columnVisibility);
  }, []);

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

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-4">
        <TableHeader
          searchQuery={searchQuery}
          isLoading={isLoading}
          onSearch={onSearch}
          onReset={onReset}
          onRefresh={onRefresh}
          autoRefresh={autoRefresh}
          onAutoRefreshChange={setAutoRefresh}
          columnVisibility={columnVisibility}
          onColumnToggle={(columnId) => {
            setColumnVisibility((prev) => ({
              ...prev,
              [columnId]: !prev[columnId],
            }));
          }}
        />

        <PCDataTable
          data={tableData}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onFuzzyFilter={onFuzzyFilter}
          pagination={pagination}
          setPagination={setPagination}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />

        <MobileDataList
          data={tableData}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default Home;
