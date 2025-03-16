import { useCallback } from 'preact/compat';
import { FilterFn } from '@tanstack/react-table';
import { IDisplayServerItem } from '@/models/data-table.model';

export function useTableFilter() {
  const onFuzzyFilter = useCallback<FilterFn<IDisplayServerItem>>(
    (row, _columnId, filterValue) => {
      console.log('on filter', row, filterValue);
      // 全局搜索，检查所有相关字段
      const searchValue = filterValue.toLowerCase();
      return (
        row.original.name.toString().toLowerCase().includes(searchValue) ||
        row.original.ipAddress.includes(searchValue) ||
        row.original.port.toString().includes(searchValue) ||
        row.original.country.toLowerCase().includes(searchValue) ||
        row.original.mode.toLowerCase().includes(searchValue) ||
        (row.original.mapId.split('/').pop()?.includes(searchValue) ?? false) ||
        (row.original.comment?.toLowerCase().includes(searchValue) ?? false) ||
        (row.original.url?.toLowerCase().includes(searchValue) ?? false) ||
        row.original.version.toString().includes(searchValue) ||
        row.original.currentPlayers.toString().includes(searchValue) ||
        row.original.playerList.some((player) =>
          player.toString().toLowerCase().includes(searchValue),
        )
      );
    },
    [],
  );

  return { onFuzzyFilter };
}
