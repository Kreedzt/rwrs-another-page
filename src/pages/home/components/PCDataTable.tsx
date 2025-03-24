import React, { useMemo } from 'preact/compat';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { columns } from './Columns';
import { DataList } from './DataList';
import { TableStats } from './TableStats';
import { useTableFilter } from '../hooks/useTableFilter';
import { FilterValue } from '../types';
import { filters } from './QuickFilterButtons';

interface PCDataTableProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: FilterValue;
  pagination: PaginationState;
  setPagination: (
    value: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => void;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export const PCDataTable: React.FC<PCDataTableProps> = ({
  data,
  isLoading,
  searchQuery,
  pagination,
  setPagination,
  columnVisibility,
  setColumnVisibility,
}) => {
  const { onFuzzyFilter } = useTableFilter();

  const filteredData = useMemo(() => {
    if (!searchQuery.quickFilters || searchQuery.quickFilters.length === 0) {
      return data;
    }

    return data.filter((item) => {
      const passesQuickFilters = searchQuery.quickFilters.some((filterId) => {
        const filterObj = filters.find((f) => f.id === filterId);
        return filterObj ? filterObj.filter(item) : true;
      });

      return passesQuickFilters;
    });
  }, [data, searchQuery.quickFilters]);

  // 保存表格配置信息，避免每次渲染重新创建所有配置
  const tableConfig = useMemo(
    () => ({
      data: filteredData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      globalFilterFn: onFuzzyFilter,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      autoResetPageIndex: true,
      state: {
        pagination,
        columnVisibility,
        globalFilter: searchQuery.searchQuery,
      },
    }),
    [
      data,
      pagination,
      columnVisibility,
      searchQuery.searchQuery,
      setColumnVisibility,
      setPagination,
      onFuzzyFilter,
    ],
  );

  // 创建表格
  const table = useReactTable(tableConfig);

  const filteredCount = table.getFilteredRowModel().rows.length;
  const filteredPlayerCount = table
    .getFilteredRowModel()
    .rows.reduce((acc, server) => acc + server.original.currentPlayers, 0);

  const { totalPlayerCount, totalCount } = useMemo(
    () => ({
      totalPlayerCount: data.reduce(
        (acc, server) => acc + server.currentPlayers,
        0,
      ),
      totalCount: data.length,
    }),
    [data, filteredData],
  );

  // 渲染界面
  return (
    <div class="hidden md:flex flex-col flex-1 overflow-auto w-full min-w-[1200px]">
      <TableStats
        className="flex gap-x-4"
        filteredCount={filteredCount}
        totalCount={totalCount}
        filteredPlayerCount={filteredPlayerCount}
        totalPlayerCount={totalPlayerCount}
      />
      <DataList isLoading={isLoading} table={table} columns={columns} />
    </div>
  );
};
