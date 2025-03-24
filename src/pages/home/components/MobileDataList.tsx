import React, { useState, useMemo, useCallback } from 'preact/compat';
import type { MobileDataListProps } from '../types';
import { ServerItem } from './ServerItem';
import { TableStats } from './TableStats';
import { filters } from './QuickFilterButtons';

export const MobileDataList: React.FC<MobileDataListProps> = ({
  data,
  isLoading,
  searchQuery,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const filterValues = useMemo(() => {
    return {
      query: searchQuery.searchQuery
        ? searchQuery.searchQuery.toLowerCase()
        : '',
      quickFilters: searchQuery.quickFilters || [],
    };
  }, [searchQuery.searchQuery, searchQuery.quickFilters]);

  const filteredData = useMemo(() => {
    if (!filterValues.query && filterValues.quickFilters.length === 0)
      return data;

    const query = filterValues.query;
    const activeFilters = filterValues.quickFilters;

    return data.filter((item) => {
      const passesTextSearch =
        !query ||
        (() => {
          const name = item.name.toString().toLowerCase();
          const mode = item.mode.toLowerCase();
          const mapId = item.mapId.toLowerCase();
          const lastMapId = mapId.split('/').pop() || '';

          return (
            name.includes(query) ||
            item.ipAddress.includes(query) ||
            item.port.toString().includes(query) ||
            item.country.toLowerCase().includes(query) ||
            mode.includes(query) ||
            lastMapId.includes(query) ||
            (item.comment?.toLowerCase().includes(query) ?? false) ||
            (item.url?.toLowerCase().includes(query) ?? false) ||
            item.playerList.some(
              (player) =>
                typeof player === 'string' &&
                player.toLowerCase().includes(query),
            )
          );
        })();

      // If no active filters, pass filter check
      if (activeFilters.length === 0) return passesTextSearch;

      // Apply each filter and check if the item passes any of the active filters
      const passesQuickFilters = activeFilters.some((filterId) => {
        const filterObj = filters.find((f) => f.id === filterId);
        return filterObj ? filterObj.filter(item) : true;
      });

      return passesTextSearch && passesQuickFilters;
    });
  }, [data, filterValues]);

  const toggleRow = useCallback((serverId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [serverId]: !prev[serverId],
    }));
  }, []);

  const { totalPlayerCount, filteredPlayerCount } = useMemo(
    () => ({
      totalPlayerCount: data.reduce(
        (acc, server) => acc + server.currentPlayers,
        0,
      ),
      filteredPlayerCount: filteredData.reduce(
        (acc, server) => acc + server.currentPlayers,
        0,
      ),
    }),
    [data, filteredData],
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 md:hidden">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 md:hidden">
      <TableStats
        filteredCount={filteredData.length}
        totalCount={data.length}
        filteredPlayerCount={filteredPlayerCount}
        totalPlayerCount={totalPlayerCount}
      />
      {filteredData.map((server) => {
        const serverId = `${server.ipAddress}:${server.port}`;
        const isExpanded = !!expandedRows[serverId];

        return (
          <ServerItem
            key={serverId}
            server={server}
            expanded={isExpanded}
            onToggle={() => toggleRow(serverId)}
            searchQuery={searchQuery.searchQuery}
          />
        );
      })}
      {filteredData.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No servers found
        </div>
      )}
    </div>
  );
};
