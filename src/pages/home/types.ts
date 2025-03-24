import { IDisplayServerItem } from '@/models/data-table.model';

export interface FilterValue {
  searchQuery: string;
  quickFilters: string[];
}

export interface TableHeaderProps {
  searchQuery: string;
  isLoading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onRefresh: () => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (checked: boolean) => void;
}

export interface TableStatsProps {
  filteredCount: number;
  totalCount: number;
  filteredPlayerCount: number;
  totalPlayerCount: number;
}

export interface PCDataTableProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: FilterValue;
  onFuzzyFilter: (row: any, columnId: string, filterValue: string | FilterValue) => boolean;
}

export interface MobileDataListProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: FilterValue;
  onRefresh: () => void;
}

export interface ServerItemProps {
  server: IDisplayServerItem;
  expanded: boolean;
  onToggle: () => void;
  searchQuery: string;
}