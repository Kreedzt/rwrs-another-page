import { createColumnHelper } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HighlightText } from '@/components/custom/highlight-text';

const columnHelper = createColumnHelper<IDisplayServerItem>();

export const columns = [
  columnHelper.accessor('name', {
    id: 'name',
    cell: ({ table, getValue }) => (
      <HighlightText
        text={getValue()}
        searchQuery={table.getState().globalFilter || ''}
      />
    ),
    header: 'Name',
  }),
  columnHelper.accessor('ipAddress', {
    id: 'ipAddress',
    cell: ({ table, getValue }) => (
      <HighlightText
        text={getValue()}
        searchQuery={table.getState().globalFilter || ''}
      />
    ),
    header: 'IP',
  }),
  columnHelper.accessor('port', {
    id: 'port',
    cell: ({ table, getValue }) => (
      <HighlightText
        text={getValue().toString()}
        searchQuery={table.getState().globalFilter || ''}
      />
    ),
    header: 'Port',
  }),
  columnHelper.accessor('bots', {
    id: 'bots',
    cell: ({ getValue }) => getValue(),
    header: 'Bots',
  }),
  columnHelper.accessor('country', {
    id: 'country',
    cell: ({ table, getValue }) => (
      <HighlightText
        text={getValue()}
        searchQuery={table.getState().globalFilter || ''}
      />
    ),
    header: 'Country',
  }),
  columnHelper.accessor('mode', {
    id: 'mode',
    cell: ({ table, getValue }) => (
      <Badge variant="secondary">
        <HighlightText
          text={getValue()}
          searchQuery={table.getState().globalFilter || ''}
        />
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
          <HighlightText
            text={lastMapId}
            searchQuery={table.getState().globalFilter || ''}
          />
        </Badge>
      );
    },
    header: 'Map',
  }),
  columnHelper.accessor((row) => `${row.currentPlayers} / ${row.maxPlayers}`, {
    id: 'playerCount',
    header: 'Capacity',
  }),
  columnHelper.accessor('playerList', {
    id: 'playerList',
    cell: ({ table, getValue }) => {
      const players = getValue();
      return (
        <div className="flex flex-wrap gap-1">
          {players
            .filter((player) => typeof player === 'string' && player.length > 0)
            .map((player, idx) => (
              <Badge key={idx}>
                <HighlightText
                  text={player.toString()}
                  searchQuery={table.getState().globalFilter || ''}
                />
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
      <HighlightText
        text={getValue() || ''}
        searchQuery={table.getState().globalFilter || ''}
      />
    ),
    header: 'Comment',
  }),
  columnHelper.accessor('dedicated', {
    id: 'dedicated',
    cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
    header: 'Dedicated',
  }),
  columnHelper.accessor('mod', {
    id: 'mod',
    cell: ({ getValue }) => (getValue() === 1 ? 'Yes' : 'No'),
    header: 'Mod',
  }),
  columnHelper.accessor('url', {
    id: 'url',
    cell: ({ table, getValue }) => {
      const url = getValue();
      return (
        <a href={url || '#'} target="_blank">
          <HighlightText
            text={url || ''}
            searchQuery={table.getState().globalFilter || ''}
          />
        </a>
      );
    },
    header: 'URL',
  }),
  columnHelper.accessor('version', {
    id: 'version',
    cell: ({ table, getValue }) => (
      <HighlightText
        text={getValue().toString()}
        searchQuery={table.getState().globalFilter || ''}
      />
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
