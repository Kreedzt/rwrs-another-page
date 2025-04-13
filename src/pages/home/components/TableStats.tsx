import { cn } from '@/lib/utils';
import React from 'preact/compat';
import { useIntl } from 'react-intl';

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
  const intl = useIntl();
  return (
    <div class={cn('text-sm text-muted-foreground', className)}>
      <p>
        {intl.formatMessage(
          { id: "app.stats.servers", defaultMessage: "{filtered} of {total} servers" },
          {
            filtered: <span className="text-primary">{filteredCount}</span>,
            total: <span className="text-primary">{totalCount}</span>
          }
        )}
      </p>
      <p>
        {intl.formatMessage(
          { id: "app.stats.players", defaultMessage: "{filtered} of {total} players" },
          {
            filtered: <span className="text-primary">{filteredPlayerCount}</span>,
            total: <span className="text-primary">{totalPlayerCount}</span>
          }
        )}
      </p>
    </div>
  );
};
