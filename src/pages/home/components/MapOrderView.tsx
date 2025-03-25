import React, { useMemo, useState } from 'preact/compat';
import { IDisplayServerItem } from '@/models/data-table.model';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { filters } from './QuickFilterButtons';

// Import the maps data directly
import mapsData from '../../../../public/maps.json';

interface MapOrderViewProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  activeFilter: string;
}

interface ServerItemProps {
  server: IDisplayServerItem;
  expanded: boolean;
  onToggle: () => void;
}

interface MapItem {
  id: string;
  name: string;
}

// Create a typed version of the map data
const mapData: Record<string, MapItem[]> = mapsData;

const ServerItem: React.FC<ServerItemProps> = ({
  server,
  expanded,
  onToggle,
}) => {
  return (
    <div className="pl-2 md:pl-6 mb-2">
      <div
        className="flex items-center p-2 rounded hover:bg-accent cursor-pointer"
        onClick={onToggle}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
        )}
        <div className="font-normal text-sm text-primary/90 truncate">{server.name}</div>
        <Badge
          variant="outline"
          className="ml-2 flex-shrink-0"
        >{`${server.currentPlayers}/${server.maxPlayers}`}</Badge>
      </div>

      {expanded && (
        <div className="p-3 pl-4 md:pl-6 ml-2 mt-1 rounded bg-card/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">IP:</span>{' '}
              {server.ipAddress}:{server.port}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Country:</span>{' '}
              {server.country}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Mode:</span> {server.mode}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Bots:</span> {server.bots}
            </div>
            {server.mapName && (
              <div className="text-sm md:col-span-2">
                <span className="text-muted-foreground">Map:</span>{' '}
                {server.mapName}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const MapOrderView: React.FC<MapOrderViewProps> = ({
  data,
  isLoading,
  activeFilter,
}) => {
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});

  console.log('mapData', mapData, 'data', data, 'activeFilter', activeFilter);

  // Get maps for the active filter
  const maps = useMemo(() => {
    return mapData[activeFilter as keyof typeof mapData] || [];
  }, [activeFilter]);

  // Filter servers based on active filter
  const filteredServers = useMemo(() => {
    if (!activeFilter) return data;

    const activeFilterObj = filters.find((f) => f.id === activeFilter);
    if (!activeFilterObj) return data;

    return data.filter((server) => activeFilterObj.filter(server));
  }, [data, activeFilter]);

  console.log('filteredServers', filteredServers);

  // Group servers by map name
  const serversByMap = useMemo(() => {
    const result: Record<string, IDisplayServerItem[]> = {};

    // Initialize all maps with empty arrays
    maps.forEach((map: MapItem) => {
      result[map.id] = [];
    });

    // Group servers by map name
    filteredServers.forEach((server) => {
      const mapName = server.mapId.split('/').pop();
      if (!mapName) return;
      console.log('mapName diff', mapName, result[mapName]);
      if (mapName && result[mapName]) {
        result[mapName].push(server);
      }
    });

    console.log('result', result);

    return result;
  }, [filteredServers, maps]);

  const toggleServerExpand = (serverId: string) => {
    setExpandedServers((prev) => ({
      ...prev,
      [serverId]: !prev[serverId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const filterName =
    filters.find((f) => f.id === activeFilter)?.label || activeFilter;

  return (
    <div className="flex flex-col w-full overflow-x-auto">
      <div className="text-lg font-semibold mb-4 px-2 md:px-0">
        Map Order: {filterName}
      </div>

      {maps.length === 0 ? (
        <div className="text-center p-4">No maps found for this filter.</div>
      ) : (
        <div className="space-y-4 px-2 md:px-0 border rounded-md p-3">
          {maps.map((map: MapItem) => (
            <div key={map.id} className="mb-4 last:mb-0 px-4">
              <div className="text-xl font-semibold mb-3 flex flex-wrap items-center border-b pb-2">
                <span className="mr-2 text-primary">{map.name}</span>
                <Badge 
                  variant="secondary" 
                  className="mr-2 font-normal text-xs"
                >
                  {serversByMap[map.id]?.length || 0} servers
                </Badge>
                <span className="text-xs text-muted-foreground">{map.id}</span>
              </div>

              {serversByMap[map.id] && serversByMap[map.id].length > 0 && (
                serversByMap[map.id].map((server) => (
                  <ServerItem
                    key={`${server.ipAddress}:${server.port}`}
                    server={server}
                    expanded={
                      !!expandedServers[`${server.ipAddress}:${server.port}`]
                    }
                    onToggle={() =>
                      toggleServerExpand(`${server.ipAddress}:${server.port}`)
                    }
                  />
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
