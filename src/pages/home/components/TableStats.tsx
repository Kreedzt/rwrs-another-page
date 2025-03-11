import React from 'preact/compat';
import { Table } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';

interface TableStatsProps {
  table: Table<IDisplayServerItem>;
  tableData: IDisplayServerItem[];
}

export const TableStats: React.FC<TableStatsProps> = ({ table, tableData }) => {
  return (
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
            .rows.reduce((acc, cur) => acc + cur.original.currentPlayers, 0)}
        </code>
      </p>
    </div>
  );
};