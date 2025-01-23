import React, { useCallback, useEffect, useState } from 'preact/compat';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  useReactTable,
} from '@tanstack/react-table';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data: tableData = [],
    error,
    isLoading,
    mutate,
  } = useSWR('/api/data-table', DataTableService.listAll);

  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId);
      if (typeof rowValue === 'string') {
        return rowValue.toLowerCase().includes(filterValue.toLowerCase());
      } else if (Array.isArray(rowValue)) {
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
    filterFns: {
      fuzzy: onFuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'fuzzy',
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: true,
  });

  const onSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    console.log('Searching for:', value);
    setSearchQuery(value);
    table.setGlobalFilter(value);
  }, []);

  const onReset = useCallback(() => {
    setSearchQuery('');
    table.setGlobalFilter(null);
  }, []);

  const onRefresh = useCallback(() => {
    console.log('Refreshing data...');

    mutate();
    setSearchQuery('');
    table.setGlobalFilter(null);
  }, [mutate]);

  return (
    <div class="container">
      <h1>RWRS Another Page</h1>
      <div class="search-container w-full">
        <Input
          type="text"
          value={searchQuery}
          onInput={onSearch}
          placeholder="Enter search query"
          disabled={isLoading}
        ></Input>
        <Button disabled={isLoading} onClick={onReset}>
          Reset
        </Button>
        <Button disabled={isLoading} className="ml-2" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      <div class="mb-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Total :
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {tableData.length}
          </code>
          Visible :
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {table.getRowModel().rows?.length}
          </code>
        </p>
      </div>
      <div class="table-container">
        <DataList isLoading={isLoading} table={table} columns={columns} />
      </div>
    </div>
  );
};

export default Home;
