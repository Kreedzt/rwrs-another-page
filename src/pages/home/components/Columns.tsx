import { createColumnHelper } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const columnHelper = createColumnHelper<IDisplayServerItem>();

export const columns = [
  columnHelper.display({
    id: 'name',
    cell: ({ row }) => row.original.name,
    header: 'Name',
  }),
  columnHelper.display({
    id: 'ipAddress',
    cell: ({ row }) => row.original.ipAddress,
    header: 'IP',
  }),
  columnHelper.display({
    id: 'port',
    cell: ({ row }) => row.original.port,
    header: 'Port',
  }),
  columnHelper.display({
    id: 'bots',
    cell: ({ row }) => row.original.bots,
    header: 'Bots',
  }),
  columnHelper.display({
    id: 'country',
    cell: ({ row }) => row.original.country,
    header: 'Country',
  }),
  columnHelper.display({
    id: 'mode',
    cell: ({ row }) => <Badge variant="secondary">{row.original.mode}</Badge>,
    header: 'Mode',
  }),
  columnHelper.display({
    id: 'mapId',
    cell: ({ row }) => {
      const lastMapId = row.original.mapId.split('/').pop();
      return <Badge variant="outline">{lastMapId}</Badge>;
    },
    header: 'Map',
  }),
  columnHelper.display({
    id: 'playerCount',
    cell: ({ row }) =>
      `${row.original.currentPlayers} / ${row.original.maxPlayers}`,
    header: 'Capacity',
  }),
  columnHelper.display({
    id: 'playerList',
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
    header: 'Player List',
  }),
  columnHelper.display({
    id: 'comment',
    cell: ({ row }) => row.original.comment,
    header: 'Comment',
  }),
  columnHelper.display({
    id: 'dedicated',
    cell: ({ row }) => {
      const isDedicated = row.original.dedicated;
      return isDedicated ? 'Yes' : 'No';
    },
    header: 'Dedicated',
  }),
  columnHelper.display({
    id: 'mod',
    cell: ({ row }) => {
      const mod = row.original.mod;
      return mod === 1 ? 'Yes' : 'No';
    },
    header: 'Mod',
  }),
  columnHelper.display({
    id: 'url',
    cell: ({ row }) => {
      const url = row.original.url;
      return (
        <a href={url || '#'} target="_blank">
          {url}
        </a>
      );
    },
    header: 'URL',
  }),
  columnHelper.display({
    id: 'version',
    cell: ({ row }) => row.original.version,
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
