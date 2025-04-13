import { cn } from '@/lib/utils';
import React from 'preact/compat';
import { FormattedMessage } from 'react-intl';

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
        <FormattedMessage
          id="app.stats.servers"
          defaultMessage="{filtered} of {total} servers"
          values={{
            filtered: <span className="text-primary">{filteredCount}</span>,
            total: <span className="text-primary">{totalCount}</span>
          }}
        />
      </p>
      <p>
        <FormattedMessage
          id="app.stats.players"
          defaultMessage="{filtered} of {total} players"
          values={{
            filtered: <span className="text-primary">{filteredPlayerCount}</span>,
            total: <span className="text-primary">{totalPlayerCount}</span>
          }}
        />
      </p>
    </div>
  );
};
