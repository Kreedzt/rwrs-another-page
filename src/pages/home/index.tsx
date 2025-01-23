import React, { useCallback, useEffect, useState } from 'preact/compat';
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
  const [tableData, setTableData] = useState<IDisplayServerItem[]>([]);

  useEffect(() => {
    DataTableService.listAll().then((data) => {
      setTableData(data);
    });
  }, []);

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

  const onSearch = useCallback((value: string) => {
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
    DataTableService.listAll().then((data) => {
      console.log('Refreshed data:', data);
      setTableData(data);
      setSearchQuery('');
      table.setGlobalFilter(null);
    });
  }, []);

  return (
    <div class="container">
      <h1>RWRS Another Page</h1>
      <div class="search-container w-full">
        <Input
          type="text"
          value={searchQuery}
          onInput={(e) => onSearch(e.currentTarget.value)}
          placeholder="Enter search query"
        ></Input>
        <Button onClick={onReset}>Reset</Button>
        <Button className="ml-2" onClick={onRefresh}>
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
        <DataList table={table} columns={columns} />
      </div>
    </div>
  );
};

export default Home;
