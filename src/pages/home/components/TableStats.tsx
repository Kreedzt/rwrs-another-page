import { cn } from '@/lib/utils';
import React from 'preact/compat';

interface TableStatsProps {
  filteredCount: number;
  totalCount: number;
  filteredPlayerCount: number;
  totalPlayerCount: number;
  className?: string;
}

export const TableStats: React.FC<TableStatsProps> = ({
  className,
  filteredCount,
  totalCount,
  filteredPlayerCount,
  totalPlayerCount,
}) => {
  return (
    <div class={cn('text-sm text-muted-foreground', className)}>
      <p>
        <span className="text-primary">{filteredCount}</span> of{' '}
        <span className="text-primary">{totalCount}</span> servers
      </p>
      <p>
        <span className="text-primary">{filteredPlayerCount}</span> of{' '}
        <span class="text-primary">{totalPlayerCount}</span> players
      </p>
    </div>
  );
};
