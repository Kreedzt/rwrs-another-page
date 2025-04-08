import { createColumnHelper } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HighlightText } from '@/components/custom/highlight-text';
import { FilterValue } from '../types';

const columnHelper = createColumnHelper<IDisplayServerItem>();

// 提取搜索查询字符串
const getSearchQueryFromFilter = (globalFilter: unknown): string => {
  if (!globalFilter) return '';

  if (typeof globalFilter === 'string') return globalFilter;

  if (typeof globalFilter === 'object' && globalFilter !== null) {
    const filter = globalFilter as FilterValue;
    return filter.searchQuery || '';
  }

  return '';
};

// 高亮文本单元格组件
const TextCellWithHighlight = ({
  table,
  value,
}: {
  table: any;
  value: string;
}) => {
  if (!value) return <>{value}</>;

  // 获取搜索查询
  const searchQuery = table.getState().globalFilter;

  // 如果没有搜索查询，直接返回原始值
  if (!searchQuery) return <>{value}</>;

  return <HighlightText text={value} searchQuery={searchQuery} />;
};

// 简单文本单元格
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
  columnHelper.accessor((row) => `${row.currentPlayers} / ${row.maxPlayers}`, {
    id: 'playerCount',
    cell: ({ getValue }) => <SimpleTextCell value={getValue()} />,
    header: 'Capacity',
  }),
  columnHelper.accessor('playerList', {
    id: 'playerList',
    cell: ({ table, getValue }) => {
      const players = getValue();

      // 获取搜索查询
      const searchQuery = getSearchQueryFromFilter(
        table.getState().globalFilter,
      );

      return (
        <div className="flex flex-wrap gap-1">
          {players
            .filter((player) => typeof player === 'string' && player.length > 0)
            .slice(0, 10) // 限制显示数量
            .map((player, idx) => (
              <Badge key={idx}>
                {searchQuery ? (
                  <HighlightText
                    text={player.toString()}
                    searchQuery={searchQuery}
                  />
                ) : (
                  player.toString()
                )}
              </Badge>
            ))}
        </div>
      );
    },
    header: 'Players',
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
    cell: ({ getValue }) => (
      <SimpleTextCell value={getValue() ? 'Yes' : 'No'} />
    ),
    header: 'Dedicated',
  }),
  columnHelper.accessor('mod', {
    id: 'mod',
    cell: ({ getValue }) => (
      <SimpleTextCell value={getValue() === 1 ? 'Yes' : 'No'} />
    ),
    header: 'Mod',
  }),
  columnHelper.accessor('url', {
    id: 'url',
    cell: ({ table, getValue }) => {
      const url = getValue();
      return url ? (
        <a href={url} target="_blank" className="text-blue-500 hover:underline">
          <TextCellWithHighlight table={table} value={url} />
        </a>
      ) : null;
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
    id: 'action',
    cell: ({ row }) => {
      const openUrl = `steam://rungameid/270150//server_address=${row.original.ipAddress} server_port=${row.original.port}`;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
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
