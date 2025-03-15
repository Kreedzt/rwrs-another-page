import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/custom/search-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColumnToggle } from './ColumnToggle';
import { COLUMNS_LIST } from '../constants';

interface TableHeaderProps {
  searchQuery: string;
  isLoading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
  columnVisibility: Record<string, boolean>;
  onColumnToggle: (columnId: string, checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  isLoading,
  onSearch,
  onReset,
  onRefresh,
  autoRefresh,
  onAutoRefreshChange,
  columnVisibility,
  onColumnToggle,
}) => {
  return (
    <div class="flex flex-col space-y-2 py-2 h-[80px] md:h-[120px]">
      <h1 class="text-xl font-bold">RWRS Another Page</h1>
      <div class="w-full flex items-center">
        <SearchInput
          rootClassName="flex-1"
          type="text"
          value={searchQuery}
          onInput={onSearch}
          placeholder="Search servers, maps, players, mode, country, etc..."
          disabled={isLoading}
        />
        <div class="items-center hidden md:flex">
          <Button className="ml-2" disabled={isLoading} onClick={onReset}>
            Reset
          </Button>
          <Button disabled={isLoading} className="ml-2" onClick={onRefresh}>
            Refresh
          </Button>
          <div className="ml-2 flex items-center">
            <Switch
              checked={autoRefresh}
              onCheckedChange={onAutoRefreshChange}
              disabled={isLoading}
            />
            <Label className="ml-2">Auto Refresh</Label>
          </div>
          <div className="ml-2">
            <ColumnToggle
              columnsList={COLUMNS_LIST}
              columnVisibility={columnVisibility}
              onColumnToggle={onColumnToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
