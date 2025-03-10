import { Badge } from '@/components/ui/badge';
import { IDisplayServerItem } from '@/models/data-table.model';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IDisplayServerItem>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'ip_address',
    accessorKey: 'ipAddress',
    header: 'IP',
  },
  {
    id: 'port',
    accessorKey: 'port',
    header: 'Port',
  },
  {
    id: 'map_name',
    accessorKey: 'mapName',
    header: 'Map',
    cell: ({ row }) => {
      const lastMapId = row.original.mapId.split('/').pop();
      return lastMapId;
    },
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
    id: 'current_players',
    accessorKey: 'currentPlayers',
    header: 'Capacity',
    cell: ({ row }) => {
      return `${row.original.currentPlayers}/${row.original.maxPlayers}`;
    },
  },
  {
    id: 'dedicated',
    accessorKey: 'dedicated',
    header: 'Dedicated',
    cell: ({ row }) => {
      return row.original.dedicated ? 'Yes' : 'No';
    },
  },
  {
    id: 'mod',
    accessorKey: 'mod',
    header: 'Mod',
    cell: ({ row }) => {
      return row.original.mod === 1 ? 'Yes' : 'No';
    },
  },
  {
    id: 'mode',
    accessorKey: 'mode',
    header: 'Mode',
  },
  {
    id: 'player_list',
    accessorKey: 'playerList',
    header: 'Players',
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap">
          {row.original.playerList.map((player) => (
            <span key={player} className="mr-2 mb-2">
              <Badge>{player}</Badge>
            </span>
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
    id: 'url',
    accessorKey: 'url',
    header: 'URL',
  },
  {
    id: 'realm',
    accessorKey: 'realm',
    header: 'Realm',
  },
  {
    id: 'version',
    accessorKey: 'version',
    header: 'Version',
  },
];
