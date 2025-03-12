import React, { useState, useMemo } from 'preact/compat';
import type { MobileDataListProps } from '../types';
import { ServerItem } from './ServerItem';
import { TableStats } from './TableStats';

export const MobileDataList: React.FC<MobileDataListProps> = ({
  data,
  isLoading,
  searchQuery,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.mapName?.toLowerCase().includes(query) ||
        item.mode.toLowerCase().includes(query) ||
        item.playerList.some(
          (player) =>
            typeof player === 'string' && player.toLowerCase().includes(query),
        ),
    );
  }, [data, searchQuery]);

  const toggleRow = (serverId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [serverId]: !prev[serverId],
    }));
  };

  const totalPlayerCount = useMemo(() => {
    return data.reduce((acc, server) => acc + server.currentPlayers, 0);
  }, [data]);

  const filteredPlayerCount = useMemo(() => {
    return filteredData.reduce((acc, server) => acc + server.currentPlayers, 0);
  }, [filteredData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 md:hidden">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-4 md:hidden">
      <TableStats
        filteredCount={filteredData.length}
        totalCount={data.length}
        filteredPlayerCount={filteredPlayerCount}
        totalPlayerCount={totalPlayerCount}
      />
      {filteredData.map((server) => (
        <ServerItem
          key={`${server.ipAddress}:${server.port}`}
          server={server}
          expanded={!!expandedRows[`${server.ipAddress}:${server.port}`]}
          onToggle={() => toggleRow(`${server.ipAddress}:${server.port}`)}
        />
      ))}
      {filteredData.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No servers found
        </div>
      )}
    </div>
  );
};
