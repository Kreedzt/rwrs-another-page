import React, { useMemo, memo, useEffect } from 'preact/compat';
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

// 使用 memo 优化 PCDataTable 组件，避免不必要的重新渲染
export const PCDataTable: React.FC<PCDataTableProps> = memo(({
  data,
  isLoading,
  searchQuery,
  pagination,
  setPagination,
  columnVisibility,
  setColumnVisibility,
}) => {
  const { onFuzzyFilter } = useTableFilter();
  
  // 使用useMemo缓存数据，防止不必要的重新计算
  const memoizedData = useMemo(() => data, [data]);
  
  // 检查是否有筛选条件
  const hasFilter = useMemo(() => 
    Boolean(searchQuery.searchQuery || searchQuery.quickFilters.length > 0),
  [searchQuery.searchQuery, searchQuery.quickFilters]);

  // 创建表格实例，应用优化配置
  const table = useReactTable<IDisplayServerItem>({
    columns,
    data: memoizedData,
    state: {
      columnVisibility,
      pagination,
      globalFilter: searchQuery,
    },
    // 分页和筛选性能优化配置
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: onFuzzyFilter,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    autoResetPageIndex: true,
    // 允许全局筛选但禁用其他可能导致性能问题的功能
    enableRowSelection: true,
    enableColumnFilters: false,
    enableGlobalFilter: true,
    enableMultiSort: false,
    manualPagination: false,
    // 关闭调试日志，减轻控制台压力
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // 当筛选条件变化时重置到第一页
  useEffect(() => {
    if (pagination.pageIndex !== 0) {
      setPagination({
        ...pagination,
        pageIndex: 0
      });
    }
  }, [searchQuery]);
  
  // 优化统计数据计算，只在需要时进行计算
  const { filteredRowsCount, filteredPlayersCount, totalPlayersCount } = useMemo(() => {
    // 总计玩家数仅依赖原始数据
    const totalPlayerCount = data.reduce((acc, row) => acc + row.currentPlayers, 0);
    
    // 如果没有筛选，数据和过滤数据相同
    if (!hasFilter) {
      return {
        filteredRowsCount: data.length,
        filteredPlayersCount: totalPlayerCount,
        totalPlayersCount: totalPlayerCount
      };
    }
    
    // 有筛选时获取过滤后的行
    const filteredRows = table.getFilteredRowModel().rows;
    return {
      filteredRowsCount: filteredRows.length,
      filteredPlayersCount: filteredRows.reduce(
        (acc, row) => acc + row.original.currentPlayers, 
        0
      ),
      totalPlayersCount: totalPlayerCount
    };
  }, [data, hasFilter, table.getFilteredRowModel().rows, searchQuery]);

  return (
    <div class="hidden md:flex flex-col flex-1 overflow-auto w-full min-w-[1200px]">
      <TableStats
        className="flex gap-x-4"
        filteredCount={filteredRowsCount}
        totalCount={data.length}
        filteredPlayerCount={filteredPlayersCount}
        totalPlayerCount={totalPlayersCount}
      />
      <DataList isLoading={isLoading} table={table} columns={columns} />
    </div>
  );
});
