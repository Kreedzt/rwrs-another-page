import React, { useCallback, useState, useEffect } from 'preact/compat';
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
  action: true,
};

// Get initial search query from URL
const getInitialSearchQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') || '';
};

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(getInitialSearchQuery());
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
      if (columnId === 'current_players') {
        return row.original.playerList.some((player) => {
          return (
            typeof player === 'string' &&
            player.toLowerCase().includes(filterValue.toLowerCase())
          );
        });
      }
      if (columnId === 'map_name') {
        const lastMapId = row.original.mapId.split('/').pop();
        return lastMapId?.includes(filterValue) ?? false;
      }
      if (typeof rowValue === 'string') {
        return rowValue.toLowerCase().includes(filterValue.toLowerCase());
      } else if (Array.isArray(rowValue)) {
        // console.log('rowValue is array', rowValue);
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
      globalFilter: searchQuery, // 直接使用 searchQuery 作为全局过滤器
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
    autoResetPageIndex: true, // 当过滤条件改变时自动重置页码
  });

  // Update URL when search query changes
  const updateSearchParams = useCallback((query: string) => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }, []);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setSearchQuery(value);
      updateSearchParams(value);

      // 搜索时总是重置到第一页
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    },
    [updateSearchParams],
  );

  const onReset = useCallback(() => {
    setSearchQuery('');
    updateSearchParams('');

    // Reset pagination state
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [pagination.pageSize, updateSearchParams]);

  const onRefresh = useCallback(() => {
    console.log('Refreshing data...');
    mutate();
    setSearchQuery('');
    updateSearchParams('');

    // Reset pagination state
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
  }, [mutate, pagination.pageSize, updateSearchParams]);

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

  // 监听搜索条件变化，更新分页状态
  useEffect(() => {
    // 获取过滤后的数据总行数
    const filteredRowsLength = table.getFilteredRowModel().rows.length;
    const currentPageSize = pagination.pageSize;

    // 计算最大页数
    const maxPageIndex = Math.max(
      0,
      Math.ceil(filteredRowsLength / currentPageSize) - 1,
    );

    // 如果当前页码超出范围，重置为最后一页
    if (pagination.pageIndex > maxPageIndex) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: maxPageIndex,
      }));
    }
  }, [searchQuery, table, pagination.pageSize]);

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
              placeholder="Search name, ip, map, players, mode, etc..."
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
          <p className="flex items-center gap-2 mb-2">
            <span>Total Servers:</span>
            <code className="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold">
              {tableData.length}
            </code>
            <span>Filtered Servers:</span>
            <code className="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold">
              {table.getFilteredRowModel().rows.length}
            </code>
            <span>Total Players:</span>
            <code className="relative rounded bg-muted px-1 py-1 font-mono text-sm font-semibold">
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
