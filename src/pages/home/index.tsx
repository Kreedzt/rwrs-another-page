import React, { useCallback, useState, useEffect } from 'preact/compat';
import useSWR from 'swr';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { DataTableService } from '@/services/data-table.service';
import { IDisplayServerItem } from '@/models/data-table.model';
import { useToast } from '@/hooks/use-toast';
import { columns } from './components/ColumnsA';
import { DataList } from './components/DataList';
import { TableHeader } from './components/TableHeader';
import { TableStats } from './components/TableStats';
import { useTableSearch } from './hooks/useTableSearch';
import { useTableFilter } from './hooks/useTableFilter';
import { INITIAL_COLUMNS_VISIBILITY, DEFAULT_PAGE_SIZE } from './constants';

const Home: React.FC = () => {
  const [columnVisibility, setColumnVisibility] = useState(
    INITIAL_COLUMNS_VISIBILITY,
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { toast } = useToast();
  const { searchQuery, handleSearch, handleReset } = useTableSearch();
  const { onFuzzyFilter } = useTableFilter();

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
    refreshInterval: 10 * 1000,
  });

  const table = useReactTable<IDisplayServerItem>({
    columns,
    data: tableData,
    state: {
      columnVisibility,
      pagination,
      globalFilter: searchQuery,
    },
    filterFns: {
      fuzzy: onFuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: onFuzzyFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    manualPagination: false,
    autoResetPageIndex: true,
  });

  useEffect(() => {
    const filteredRowsLength = table.getFilteredRowModel().rows.length;
    const maxPageIndex = Math.max(
      0,
      Math.ceil(filteredRowsLength / pagination.pageSize) - 1,
    );

    if (pagination.pageIndex > maxPageIndex) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: maxPageIndex,
      }));
    }
  }, [searchQuery, table, pagination.pageSize]);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSearch(e.currentTarget.value, setPagination, pagination.pageSize);
    },
    [handleSearch, pagination.pageSize],
  );

  const onReset = useCallback(() => {
    handleReset(setPagination, pagination.pageSize);
  }, [handleReset, pagination.pageSize]);

  const onRefresh = useCallback(() => {
    mutate();
    handleReset(setPagination, pagination.pageSize);
  }, [mutate, handleReset, pagination.pageSize]);

  const onColumnToggle = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, []);

  return (
    <div class="container min-h-screen">
      <div class="flex flex-col w-full">
        <TableHeader
          searchQuery={searchQuery}
          isLoading={isLoading}
          columnVisibility={columnVisibility}
          onSearch={onSearch}
          onReset={onReset}
          onRefresh={onRefresh}
          onColumnToggle={onColumnToggle}
        />
        <TableStats table={table} tableData={tableData} />
      </div>
      <div class="flex-1 overflow-auto w-full">
        <div class="min-w-[1200px]">
          <DataList isLoading={isLoading} table={table} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Home;
