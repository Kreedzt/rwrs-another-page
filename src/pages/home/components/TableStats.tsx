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
  // 使用字符串插值而不是 React 元素
  const serversText = intl.formatMessage(
    { id: "app.stats.servers", defaultMessage: "{filtered} of {total} servers" },
    {
      filtered: filteredCount,
      total: totalCount
    }
  );

  const playersText = intl.formatMessage(
    { id: "app.stats.players", defaultMessage: "{filtered} of {total} players" },
    {
      filtered: filteredPlayerCount,
      total: totalPlayerCount
    }
  );

  // 将数字部分用颜色高亮显示
  const highlightNumbers = (text: string) => {
    // 将数字包装在带有颜色的 span 中
    return text.replace(/\d+/g, (match) => `<span class="text-primary">${match}</span>`);
  };

  return (
    <div class={cn('text-sm text-muted-foreground', className)}>
      <p dangerouslySetInnerHTML={{ __html: highlightNumbers(serversText) }} />
      <p dangerouslySetInnerHTML={{ __html: highlightNumbers(playersText) }} />
    </div>
  );
};
