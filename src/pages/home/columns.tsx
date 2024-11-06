import { Badge } from '@/components/ui/badge';
import { IDataTableItem } from '@/models/data-table.model';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IDataTableItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'ipAddress',
    header: 'IP',
  },
  {
    accessorKey: 'port',
    header: 'Port',
  },
  {
    accessorKey: 'mapName',
    header: 'Map',
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
    accessorKey: 'currentPlayers',
    header: 'Players',
    cell: ({ row }) => {
      return `${row.original.currentPlayers}/${row.original.maxPlayers}`;
    },
  },
  {
    accessorKey: 'dedicated',
    header: 'Dedicated',
    cell: ({ row }) => {
      return row.original.dedicated ? 'Yes' : 'No';
    },
  },
  {
    accessorKey: 'mod',
    header: 'Mod',
    cell: ({ row }) => {
      return row.original.mod === 1 ? 'Yes' : 'No';
    },
  },
  {
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
    accessorKey: 'comment',
    header: 'Comment',
  },
  {
    accessorKey: 'url',
    header: 'URL',
  },
  {
    accessorKey: 'mode',
    header: 'Mode',
  },
  {
    accessorKey: 'realm',
    header: 'Realm',
  },
  {
    accessorKey: 'version',
    header: 'Version',
  },
];
