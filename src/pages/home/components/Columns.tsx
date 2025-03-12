import { ColumnDef } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<IDisplayServerItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP Address',
  },
  {
    accessorKey: 'port',
    header: 'Port',
  },
  {
    accessorKey: 'bots',
    header: 'Bots',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'mode',
    header: 'Mode',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.getValue('mode')}</Badge>
    ),
  },
  {
    accessorKey: 'mapName',
    header: 'Map',
    cell: ({ row }) => {
      const lastMapId = row.original.mapId.split('/').pop();
      return <Badge variant="outline">{lastMapId}</Badge>;
    },
  },
  {
    accessorKey: 'playerCount',
    header: 'Capacity',
    cell: ({ row }) => {
      const server = row.original;
      return `${server.currentPlayers} / ${server.maxPlayers}`;
    },
  },
  {
    accessorKey: 'playerList',
    header: 'Players',
    cell: ({ row }) => {
      const players = row.getValue('playerList') as string[];
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
    accessorKey: 'comment',
    header: 'Comment',
  },
  {
    accessorKey: 'dedicated',
    header: 'Dedicated',
    cell: ({ row }) => {
      const isDedicated = row.getValue('dedicated') as boolean;
      return isDedicated ? 'Yes' : 'No';
    },
  },
  {
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
    accessorKey: 'version',
    header: 'Version',
  },
  {
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
