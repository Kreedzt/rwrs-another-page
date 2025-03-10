import React, { useCallback, useState } from 'preact/compat';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { columns } from './columns';
import { DataList } from './data-list';
import { DataTableService } from '@/services/data-table.service';
import { IDisplayServerItem } from '@/models/data-table.model';
import {
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/custom/search-input';
import { useToast } from '@/hooks/use-toast';

const COLUMNS_LIST = columns.map((c) => {
  return {
    id: c.id,
    title: c.header,
  };
});

const INITIAL_COLUMNS_VISIBILITY: Record<string, boolean> = {
  name: true,
  ip_address: true,
  port: true,
  map_name: true,
  bots: true,
  country: true,
  current_players: true,
  dedicated: false,
  mod: false,
  player_list: true,
  comment: false,
  url: false,
  mode: true,
  realm: false,
  version: false,
};

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [columnVisibility, setColumnVisibility] = useState(
    INITIAL_COLUMNS_VISIBILITY,
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const { toast } = useToast();

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
  });

  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId);
      console.log('onFuzzyFilter: columnId:', columnId);
      if (columnId === 'player_list') {
        console.log('rowValue is array', rowValue, row);
      }
      if (typeof rowValue === 'string') {
        return rowValue.toLowerCase().includes(filterValue.toLowerCase());
      } else if (Array.isArray(rowValue)) {
        console.log('rowValue is array', rowValue);
        return rowValue.some((value) =>
          value.toLowerCase().includes(filterValue.toLowerCase()),
        );
      }

      return false;
    },
    [],
  );

  const table = useReactTable<IDisplayServerItem>({
    columns,
    data: tableData,
    state: {
      columnVisibility,
      pagination,
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
  });

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      console.log('Searching for:', value);
      setSearchQuery(value);
      table.setGlobalFilter(value);
      // table.resetPagination();
      // table.setPageSize(table.getState().pagination.pageSize);
    },
    [table],
  );

  const onReset = useCallback(() => {
    setSearchQuery('');
    table.setGlobalFilter(null);
    table.resetPagination();
    // table.setPageSize(table.getState().pagination.pageSize);
  }, [table]);

  const onRefresh = useCallback(() => {
    console.log('Refreshing data...');

    mutate();
    setSearchQuery('');
    table.setGlobalFilter(null);
    table.resetPagination();
    // table.setPageSize(table.getState().pagination.pageSize);
  }, [mutate, table]);

  const onColumnToggle = useCallback(
    (columnId: string) => {
      setColumnVisibility((prev) => {
        console.log('Current visibility:', prev);
        console.log('Toggling column:', columnId);
        const newVisibility = {
          ...prev,
          [columnId]: !prev[columnId],
        };
        console.log('New visibility:', newVisibility);
        return newVisibility;
      });
    },
    [table],
  );

  return (
    <div class="container min-h-screen">
      <div class="flex flex-col w-full">
        {/* 头部固定区域 */}
        <div class="flex flex-col space-y-2 h-[120px] py-2">
          <h1 class="text-xl font-bold">RWRS Another Page</h1>
          <div class="w-full flex items-center">
            <SearchInput
              rootClassName="flex-1"
              type="text"
              value={searchQuery}
              onInput={onSearch}
              placeholder="Search name, ip, port, map, players, etc..."
              disabled={isLoading}
            ></SearchInput>
            <Button className="ml-2" disabled={isLoading} onClick={onReset}>
              Reset
            </Button>
            <Button disabled={isLoading} className="ml-2" onClick={onRefresh}>
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="ml-2" variant="outline">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Toggle visible columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {COLUMNS_LIST.map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={columnVisibility[c.id as string]}
                    onClick={() => onColumnToggle(c.id as string)}
                  >
                    {c.title}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div class="flex items-center min-h-[32px]">
          <p className="flex items-center gap-2">
            <span>Total Servers:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {tableData.length}
            </code>
            <span>Filtered Servers:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {table.getFilteredRowModel().rows.length}
            </code>
            <span>Total Players:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {tableData.reduce((acc, cur) => acc + cur.currentPlayers, 0)}
            </code>
            <span>Filtered Players:</span>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {table
                .getFilteredRowModel()
                .rows.reduce(
                  (acc, cur) => acc + cur.original.currentPlayers,
                  0,
                )}
            </code>
          </p>
        </div>
      </div>
      {/* 表格区域 */}
      <div class="flex-1 overflow-auto w-full">
        <div class="min-w-[1200px]">
          <DataList isLoading={isLoading} table={table} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Home;
