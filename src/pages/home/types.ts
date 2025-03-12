import { IDisplayServerItem } from '@/models/data-table.model';

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
}

export interface PCDataTableProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: string;
  onFuzzyFilter: (row: any, columnId: string, filterValue: string) => boolean;
}

export interface MobileDataListProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  searchQuery: string;
}

export interface ServerItemProps {
  server: IDisplayServerItem;
  expanded: boolean;
  onToggle: () => void;
}