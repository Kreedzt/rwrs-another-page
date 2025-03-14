import { ColumnDef } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<IDisplayServerItem>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'ipAddress',
    accessorKey: 'ipAddress',
    header: 'IP',
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: 'Port',
  },
  {
    id: 'bots',
    accessorKey: 'bots',
    header: 'Bots',
  },
  {
    id: 'country',
    accessorKey: 'country',
    header: 'Country',
  },
  {
    id: 'mode',
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('mode')}</Badge>
    ),
  },
  {
    id: 'mapId',
    accessorKey: 'mapId',
    header: 'Map',
    cell: ({ row }) => {
      const lastMapId = (row.getValue('mapId') as string).split('/').pop();
      return <Badge variant="outline">{lastMapId}</Badge>;
    },
  },
  {
    id: 'playerCount',
    accessorKey: 'playerCount',
    header: 'Capacity',
    cell: ({ row }) => {
      const server = row.original;
      return `${server.currentPlayers} / ${server.maxPlayers}`;
    },
  },
  {
    id: 'playerList',
    accessorKey: 'playerList',
    header: 'Player List',
    cell: ({ row }) => {
      const players = row.original.playerList;
      return (
        <div className="flex flex-wrap gap-1">
          {players
            .filter((player) => {
              return typeof player === 'string' && player.length > 0;
            })
            .map((player, idx) => (
              <Badge key={idx}>{player}</Badge>
            ))}
        </div>
      );
    },
  },
  {
    id: 'comment',
    accessorKey: 'comment',
    header: 'Comment',
  },
  {
    id: 'dedicated',
    accessorKey: 'dedicated',
    header: 'Dedicated',
    cell: ({ row }) => {
      const isDedicated = row.getValue('dedicated') as boolean;
      return isDedicated ? 'Yes' : 'No';
    },
  },
  {
    id: 'mod',
    accessorKey: 'mod',
    header: 'Mod',
    cell: ({ row }) => {
      const mod = row.original.mod;
      return mod === 1 ? 'Yes' : 'No';
    },
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      return (
        <a href={url} target="_blank">
          {url}
        </a>
      );
    },
  },
  {
    id: 'version',
    accessorKey: 'version',
    header: 'Version',
  },
  {
    id: 'timestamp',
    accessorKey: 'timestamp',
    header: 'Action',
    cell: ({ row }) => {
      const openUrl = `steam://rungameid/270150//server_address=${row.original.ipAddress} ${row.original.port}`;
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
  },
];
