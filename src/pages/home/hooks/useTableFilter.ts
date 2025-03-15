import { useCallback } from 'preact/compat';
import { FilterFn } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';

export function useTableFilter() {
  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId);
      console.log('touch filter', columnId, filterValue);

      switch (columnId) {
        case 'name':
          return row.original.name
            .toString()
            .toLowerCase()
            .includes(filterValue);
        case 'ipAddress':
          return row.original.ipAddress.includes(filterValue);
        case 'port':
          return row.original.port.toString().includes(filterValue);
        case 'country':
          return row.original.country.toLowerCase().includes(filterValue);
        case 'mode':
          return row.original.mode.toLowerCase().includes(filterValue);
        case 'mapId':
          return (
            row.original.mapId.split('/').pop()?.includes(filterValue) ?? false
          );
        case 'comment':
          return (
            row.original.comment?.toLowerCase().includes(filterValue) ?? false
          );
        case 'url':
          return row.original.url?.toLowerCase().includes(filterValue) ?? false;
        case 'version':
          return row.original.version.toString().includes(filterValue);
        case 'playerCount':
          return row.original.currentPlayers.toString().includes(filterValue);
        case 'playerList':
          return row.original.playerList.some((player) =>
            player.toString().toLowerCase().includes(filterValue.toLowerCase()),
          );
        default:
          return false;
      }
    },
    [],
  );

  return { onFuzzyFilter };
}
