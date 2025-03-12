import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/custom/search-input';
import { ColumnToggle } from './ColumnToggle';
import { COLUMNS_LIST } from '../constants';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TableHeaderProps {
  searchQuery: string;
  isLoading: boolean;
  columnVisibility: Record<string, boolean>;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  onColumnToggle: (columnId: string) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  isLoading,
  columnVisibility,
  onSearch,
  onReset,
  onRefresh,
  onColumnToggle,
  autoRefresh,
  onAutoRefreshChange,
}) => {
  return (
    <div class="flex flex-col space-y-2 h-[120px] py-2">
      <h1 class="text-xl font-bold">RWRS Another Page</h1>
      <div class="w-full flex items-center">
        <SearchInput
          rootClassName="flex-1"
          type="text"
          value={searchQuery}
          onInput={onSearch}
          placeholder="Search name, ip, map, players, etc..."
          disabled={isLoading}
        />
        <div class="ml-2 flex items-center space-x-2">
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={onAutoRefreshChange}
          />
          <Label htmlFor="auto-refresh">Auto Refresh</Label>
        </div>
        <Button className="ml-2" disabled={isLoading} onClick={onReset}>
          Reset
        </Button>
        <Button disabled={isLoading} className="ml-2" onClick={onRefresh}>
          Refresh
        </Button>
        <ColumnToggle
          columnsList={COLUMNS_LIST}
          columnVisibility={columnVisibility}
          onColumnToggle={onColumnToggle}
        />
      </div>
    </div>
  );
};
