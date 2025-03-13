import React from 'preact/compat';
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

interface PCDataTableProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: string;
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

  const table = useReactTable<IDisplayServerItem>({
    columns,
    data,
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
    autoResetPageIndex: true,
  });

  return (
    <div class="hidden md:flex flex-col flex-1 overflow-auto w-full min-w-[1200px]">
      <TableStats
        className="flex gap-x-4"
        filteredCount={table.getFilteredRowModel().rows.length}
        totalCount={data.length}
        filteredPlayerCount={table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => acc + row.original.currentPlayers, 0)}
        totalPlayerCount={data.reduce(
          (acc, row) => acc + row.currentPlayers,
          0,
        )}
      />
      <DataList isLoading={isLoading} table={table} columns={columns} />
    </div>
  );
};
