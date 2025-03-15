import React, { useCallback, useState } from 'preact/compat';
import useSWR from 'swr';
import { DataTableService } from '@/services/data-table.service';
import { useToast } from '@/hooks/use-toast';
import { TableHeader } from './components/TableHeader';
import { useTableSearch } from './hooks/useTableSearch';
import { MobileDataList } from './components/MobileDataList';
import { PCDataTable } from './components/PCDataTable';
import { DEFAULT_PAGE_SIZE, INITIAL_COLUMNS_VISIBILITY } from './constants';
import { PaginationState } from '@tanstack/react-table';

const Home: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();
  const { searchQuery, handleSearch, handleReset } = useTableSearch();
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

  const onColumnToggle = useCallback((columnId: string, checked: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: checked,
    }));
  }, []);

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
          onColumnToggle={onColumnToggle}
        />

        <PCDataTable
          data={tableData}
          isLoading={isLoading}
          searchQuery={searchQuery}
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
