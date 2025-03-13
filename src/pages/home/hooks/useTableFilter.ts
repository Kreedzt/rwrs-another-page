import { useCallback } from 'preact/compat';
import { FilterFn } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';

export function useTableFilter() {
  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId);
      console.log('touch filter', columnId, filterValue);

      if (columnId === 'playerList') {
        return row.original.playerList.some((player) =>
          player.toString().toLowerCase().includes(filterValue.toLowerCase()),
        );
      }

      if (columnId === 'mapId') {
        const lastMapId = row.original.mapId.split('/').pop();
        return lastMapId?.includes(filterValue) ?? false;
      }

      if (typeof rowValue === 'string') {
        return rowValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      if (Array.isArray(rowValue)) {
        return rowValue.some((value) =>
          value.toLowerCase().includes(filterValue.toLowerCase()),
        );
      }

      return false;
    },
    [],
  );

  return { onFuzzyFilter };
}
