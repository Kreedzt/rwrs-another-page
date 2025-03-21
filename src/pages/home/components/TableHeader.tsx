import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/custom/search-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColumnToggle } from './ColumnToggle';
import { COLUMNS_LIST } from '../constants';
import { QuickFilterButtons } from './QuickFilterButtons';

interface TableHeaderProps {
  searchQuery: string;
  quickFilters: string[];
  isLoading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  onQuickFilter: (filterId: string) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
  columnVisibility: Record<string, boolean>;
  onColumnToggle: (columnId: string, checked: boolean) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  searchQuery,
  quickFilters,
  isLoading,
  onSearch,
  onReset,
  onRefresh,
  onQuickFilter,
  autoRefresh,
  onAutoRefreshChange,
  columnVisibility,
  onColumnToggle,
}) => {
  return (
    <div class="flex flex-col space-y-2 py-2 h-auto md:min-h-[120px]">
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
      <div className="w-full">
        <QuickFilterButtons
          isLoading={isLoading}
          onQuickFilter={onQuickFilter}
          activeFilter={quickFilters}
        />
      </div>
    </div>
  );
};
