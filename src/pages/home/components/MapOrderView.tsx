import React, { useMemo, useState } from 'preact/compat';
import { IDisplayServerItem } from '@/models/data-table.model';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { filters } from './QuickFilterButtons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import the maps data directly
import mapsData from '../../../../public/maps.json';

interface MapOrderViewProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  activeFilters: string[];
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
  const handleJoin = () => {
    window.open(`steam://connect/${server.ipAddress}:${server.port}`, '_blank');
  };

  return (
    <div className="border rounded-lg p-4 bg-card mb-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-primary/90">{server.name}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">{server.mode}</Badge>
            <span className="text-muted-foreground">
              {server.currentPlayers} / {server.maxPlayers}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={(e) => {
              e.stopPropagation();
              handleJoin();
            }}
          >
            Join
          </Button>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <span className="text-sm text-muted-foreground">IP: </span>
              {server.ipAddress}:{server.port}
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Country: </span>
              {server.country}
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Mode: </span>
              {server.mode}
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Bots: </span>
              {server.bots}
            </div>
            {server.mapName && (
              <div className="md:col-span-2">
                <span className="text-sm text-muted-foreground">Map: </span>
                {server.mapName}
              </div>
            )}
          </div>
          <div className="md:hidden mt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleJoin}
            >
              Join Server
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const MapOrderView: React.FC<MapOrderViewProps> = ({
  data,
  isLoading,
  activeFilters,
}) => {
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});

  // Get maps for all active filters
  const allMaps = useMemo(() => {
    console.log('activeFilters', activeFilters);
    if (activeFilters.length === 0) {
      // If no filters selected, return all maps from all categories
      return Object.values(mapData).flat();
    }

    // Get unique maps from all active filters
    const mapsSet = new Set<string>();
    const mapsArray: MapItem[] = [];

    activeFilters.forEach((filterId) => {
      const filterMaps = mapData[filterId as keyof typeof mapData] || [];
      filterMaps.forEach((map) => {
        // Use map.id as unique identifier
        if (!mapsSet.has(map.id)) {
          mapsSet.add(map.id);
          mapsArray.push(map);
        }
      });
    });

    return mapsArray;
  }, [activeFilters]);

  // Filter servers based on active filters
  const filteredServers = useMemo(() => {
    if (activeFilters.length === 0) return data;

    // Get union of servers matching any of the active filters
    return data.filter((server) => {
      return activeFilters.some((filterId) => {
        const filterObj = filters.find((f) => f.id === filterId);
        return filterObj ? filterObj.filter(server) : false;
      });
    });
  }, [data, activeFilters]);

  console.log('filteredServers', filteredServers);

  // Group servers by map name
  const serversByMap = useMemo(() => {
    const result: Record<string, IDisplayServerItem[]> = {};

    // Initialize all maps with empty arrays
    allMaps.forEach((map: MapItem) => {
      result[map.id] = [];
    });

    // Group servers by map name
    filteredServers.forEach((server) => {
      const mapName = server.mapId.split('/').pop();
      if (!mapName) return;
      if (mapName && result[mapName]) {
        result[mapName].push(server);
      }
    });

    console.log('result', result);

    return result;
  }, [filteredServers, allMaps]);

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

  // Get filter names for all active filters
  const filterNames = activeFilters
    .map((filterId) => {
      const filter = filters.find((f) => f.id === filterId);
      return filter ? filter.label : filterId;
    })
    .join(', ');

  return (
    <div className="flex flex-col w-full overflow-x-auto">
      <div className="text-lg font-semibold mb-4 px-2 md:px-0">
        Map Order: {filterNames || 'All Maps'}
      </div>

      {allMaps.length === 0 ? (
        <div className="text-center p-4">
          No maps found for selected filters.
        </div>
      ) : (
        <div className="space-y-4 px-2 md:px-0 border rounded-md p-3">
          {allMaps.map((map: MapItem) => (
            <div key={map.id} className="mb-4 last:mb-0 px-4">
              <div className="text-xl font-semibold mb-3 flex flex-wrap items-center border-b pb-2">
                <span className="mr-2 text-primary">{map.name}</span>
                <Badge variant="secondary" className="mr-2 font-normal text-xs">
                  {serversByMap[map.id]?.length || 0} servers
                </Badge>
                <span className="text-xs text-muted-foreground">{map.id}</span>
              </div>

              {serversByMap[map.id] &&
                serversByMap[map.id].length > 0 &&
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
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
