import { createColumnHelper } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HighlightText } from '@/components/custom/highlight-text';
import { FilterValue } from '../types';
import { useMemo, memo } from 'preact/compat';

const columnHelper = createColumnHelper<IDisplayServerItem>();

// 提取搜索查询字符串，不使用 hook，纯函数处理
const getSearchQueryFromFilter = (globalFilter: unknown): string => {
  if (!globalFilter) return '';
  
  if (typeof globalFilter === 'string') return globalFilter;
  
  if (typeof globalFilter === 'object' && globalFilter !== null) {
    const filter = globalFilter as FilterValue;
    return filter.searchQuery || '';
  }
  
  return '';
};

// 使用 memo 包装 TextCellWithHighlight 组件，减少不必要的重新渲染
const TextCellWithHighlight = memo(({ table, value }: { table: any, value: string }) => {
  if (!value) return <>{value}</>;
  
  // 只在值改变或过滤条件改变时重新渲染
  const searchQuery = getSearchQueryFromFilter(table.getState().globalFilter);
  
  // 如果没有搜索查询，直接返回原始值，不需要高亮处理
  if (!searchQuery) return <>{value}</>;
  
  return <HighlightText text={value} searchQuery={searchQuery} />;
});

// 减少单元格渲染开销的简单文本单元格
const SimpleTextCell = ({ value }: { value: string | number }) => {
  return <>{value}</>;
};

export const columns = [
  columnHelper.accessor('name', {
    id: 'name',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue()} />
    ),
    header: 'Name',
  }),
  columnHelper.accessor('ipAddress', {
    id: 'ipAddress',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue()} />
    ),
    header: 'IP',
  }),
  columnHelper.accessor('port', {
    id: 'port',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue().toString()} />
    ),
    header: 'Port',
  }),
  columnHelper.accessor('bots', {
    id: 'bots',
    cell: ({ getValue }) => <SimpleTextCell value={getValue()} />,
    header: 'Bots',
  }),
  columnHelper.accessor('country', {
    id: 'country',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue()} />
    ),
    header: 'Country',
  }),
  columnHelper.accessor('mode', {
    id: 'mode',
    cell: ({ table, getValue }) => (
      <Badge variant="secondary">
        <TextCellWithHighlight table={table} value={getValue()} />
      </Badge>
    ),
    header: 'Mode',
  }),
  columnHelper.accessor('mapId', {
    id: 'mapId',
    cell: ({ table, getValue }) => {
      const lastMapId = getValue().split('/').pop() || '';
      return (
        <Badge variant="outline">
          <TextCellWithHighlight table={table} value={lastMapId} />
        </Badge>
      );
    },
    header: 'Map',
  }),
  // 优化不需要高亮的单元格
  columnHelper.accessor((row) => `${row.currentPlayers} / ${row.maxPlayers}`, {
    id: 'playerCount',
    cell: ({ getValue }) => <SimpleTextCell value={getValue()} />, 
    header: 'Capacity',
  }),
  columnHelper.accessor('playerList', {
    id: 'playerList',
    cell: ({ table, getValue }) => {
      const players = getValue();
      
      // 如果没有玩家或搜索条件为空，使用简化渲染
      const searchQuery = getSearchQueryFromFilter(table.getState().globalFilter);
      if (!searchQuery || players.length === 0) {
        return (
          <div className="flex flex-wrap gap-1">
            {players
              .filter((player) => typeof player === 'string' && player.length > 0)
              .slice(0, 10) // 限制显示数量
              .map((player, idx) => (
                <Badge key={idx}>{player.toString()}</Badge>
              ))}
          </div>
        );
      }
      
      // 只有在有搜索条件时才使用高亮渲染
      return (
        <div className="flex flex-wrap gap-1">
          {players
            .filter((player) => typeof player === 'string' && player.length > 0)
            .slice(0, 10) // 限制显示数量
            .map((player, idx) => (
              <Badge key={idx}>
                <TextCellWithHighlight table={table} value={player.toString()} />
              </Badge>
            ))}
        </div>
      );
    },
    header: 'Player List',
  }),
  columnHelper.accessor('comment', {
    id: 'comment',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue() || ''} />
    ),
    header: 'Comment',
  }),
  columnHelper.accessor('dedicated', {
    id: 'dedicated',
    cell: ({ getValue }) => <SimpleTextCell value={getValue() ? 'Yes' : 'No'} />,
    header: 'Dedicated',
  }),
  columnHelper.accessor('mod', {
    id: 'mod',
    cell: ({ getValue }) => <SimpleTextCell value={getValue() === 1 ? 'Yes' : 'No'} />,
    header: 'Mod',
  }),
  columnHelper.accessor('url', {
    id: 'url',
    cell: ({ table, getValue }) => {
      const url = getValue();
      return (
        <a href={url || '#'} target="_blank">
          <TextCellWithHighlight table={table} value={url || ''} />
        </a>
      );
    },
    header: 'URL',
  }),
  columnHelper.accessor('version', {
    id: 'version',
    cell: ({ table, getValue }) => (
      <TextCellWithHighlight table={table} value={getValue().toString()} />
    ),
    header: 'Version',
  }),
  columnHelper.display({
    id: 'timestamp',
    cell: ({ row }) => {
      const openUrl = `steam://rungameid/270150//server_address=${row.original.ipAddress} server_port=${row.original.port}`;
      return (
        <div className="flex gap-2">
          <Button variant="outline">
            <a href={openUrl} target="_blank">
              Join
            </a>
          </Button>
        </div>
      );
    },
    header: 'Action',
  }),
];
