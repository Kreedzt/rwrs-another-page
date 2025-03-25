import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/custom/search-input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColumnToggle } from './ColumnToggle';
import { COLUMNS_LIST } from '../constants';
import { QuickFilterButtons } from './QuickFilterButtons';
import { RefreshCw, List, MapPin } from 'lucide-react';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useTourGuide } from '../hooks/useTourGuide';

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
  viewMode: 'table' | 'map';
  onViewModeToggle: () => void;
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
  viewMode,
  onViewModeToggle,
}) => {
  const { startTour } = useTourGuide();
  return (
    <div class="flex flex-col space-y-2 py-2 h-auto md:min-h-[120px]">
      <h1 class="text-xl font-bold relative">
        RWRS Another Page
        <div className="flex items-center justify-between mb-4 absolute right-0 top-0">
          <Button
            variant="outline"
            size="icon"
            onClick={onViewModeToggle}
            title={viewMode === 'table' ? 'Switch to Map Order View' : 'Switch to Table View'}
            className="mr-2 shrink-0"
          >
            {viewMode === 'table' ? <MapPin className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={startTour}
            title="Show Help Guide"
            className="shrink-0 bg-transparent hover:bg-transparent"
          >
            <QuestionMarkCircledIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
      </h1>
      <div class="w-full flex items-center">
        <SearchInput
          id="search-input"
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
          {viewMode === 'table' && (
            <div className="ml-2" id="column-toggle">
              <ColumnToggle
                columnsList={COLUMNS_LIST}
                columnVisibility={columnVisibility}
                onColumnToggle={onColumnToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile refresh button - visible only on mobile */}
      <div className="md:hidden w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
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
