import React, { useMemo, useState } from 'preact/compat';
import { IDisplayServerItem } from '@/models/data-table.model';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { filters } from './QuickFilterButtons';
import { Button } from '@/components/ui/button';
import { HighlightText } from '@/components/custom/highlight-text';
import mapsData from '../../../../public/maps.json';

interface MapOrderViewProps {
  data: IDisplayServerItem[];
  isLoading: boolean;
  activeFilters: string[];
  searchQuery?: string;
}

interface ServerItemProps {
  server: IDisplayServerItem;
  expanded: boolean;
  onToggle: () => void;
  searchQuery?: string;
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
  searchQuery,
}) => {
  const openUrl = `steam://rungameid/270150//server_address=${server.ipAddress} server_port=${server.port}`;

  // Ensure text values are strings
  const serverName = String(server.name || '');
  const serverMode = String(server.mode || '');
  const serverCountry = String(server.country || '');
  const serverVersion = String(server.version || '');
  const serverUrl = String(server.url || '');
  const serverComment = String(server.comment || '');

  return (
    <div className="bg-card/50 rounded-lg p-3 hover:bg-accent/5 transition-colors">
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-primary/90">
              <HighlightText
                text={serverName}
                searchQuery={searchQuery || ''}
              />
            </h3>
            <Badge variant="outline" className="font-normal text-xs">
              {server.currentPlayers}/{server.maxPlayers}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="font-normal text-xs">
              <HighlightText
                text={serverMode}
                searchQuery={searchQuery || ''}
              />
            </Badge>
            <Badge variant="outline" className="font-normal text-xs">
              <HighlightText
                text={serverCountry}
                searchQuery={searchQuery || ''}
              />
            </Badge>
            {server.bots > 0 && (
              <Badge variant="outline" className="font-normal text-xs">
                {server.bots} Bots
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <a href={openUrl} target="_blank">
              Join
            </a>
          </Button>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">IP</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <HighlightText
                    text={`${server.ipAddress}`}
                    searchQuery={searchQuery || ''}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Port</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <HighlightText
                    text={`${server.port}`}
                    searchQuery={searchQuery || ''}
                  />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm text-muted-foreground">
                  <HighlightText
                    text={serverVersion}
                    searchQuery={searchQuery || ''}
                  />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {server.url && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">URL</span>
                  <a
                    href={server.url}
                    target="_blank"
                    className="text-sm text-blue-500 hover:underline truncate"
                  >
                    <HighlightText
                      text={serverUrl}
                      searchQuery={searchQuery || ''}
                    />
                  </a>
                </div>
              )}
              {server.comment && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Comment</span>
                  <span className="text-sm text-muted-foreground">
                    <HighlightText
                      text={serverComment}
                      searchQuery={searchQuery || ''}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Players</span>
              <span className="text-sm text-muted-foreground">
                {server.playerList.length} online
              </span>
            </div>
            {server.playerList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {server.playerList.map((player) => (
                  <Badge
                    key={player}
                    variant="secondary"
                    className="font-normal text-xs"
                  >
                    <HighlightText
                      text={String(player || '')}
                      searchQuery={searchQuery || ''}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No players online
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
  activeFilters,
  searchQuery,
}) => {
  const [expandedServers, setExpandedServers] = useState<
    Record<string, boolean>
  >({});

  // Get maps for all active filters
  const allMaps = useMemo(() => {
    if (activeFilters.length === 0) {
      return Object.values(mapData).flat();
    }

    const mapsSet = new Set<string>();
    const mapsArray: MapItem[] = [];

    activeFilters.forEach((filterId) => {
      const filterMaps = mapData[filterId as keyof typeof mapData] || [];
      filterMaps.forEach((map) => {
        if (!mapsSet.has(map.id)) {
          mapsSet.add(map.id);
          mapsArray.push(map);
        }
      });
    });

    return mapsArray;
  }, [activeFilters]);

  // Filter servers based on search query and active filters
  const filteredServers = useMemo(() => {
    return data.filter((item) => {
      // Text search logic
      const passesTextSearch =
        !searchQuery ||
        (() => {
          const query = searchQuery.toLowerCase();
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

      // Quick filters logic
      const passesQuickFilters =
        activeFilters.length === 0 ||
        activeFilters.some((filterId) => {
          const filterObj = filters.find((f) => f.id === filterId);
          return filterObj ? filterObj.filter(item) : true;
        });

      return passesTextSearch && passesQuickFilters;
    });
  }, [data, searchQuery, activeFilters]);

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

    // Keep the original map order from allMaps
    return {
      serversByMap: result,
      sortedMaps: allMaps,
    };
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

      {activeFilters.length === 0 ? (
        <div className="text-center p-8 space-y-4">
          <div className="text-lg text-muted-foreground">
            Select Quick Filters to View Map Order
          </div>
          <div className="text-sm text-muted-foreground">
            Choose your preferred map categories in Quick Filters to display the
            corresponding server list
          </div>
        </div>
      ) : allMaps.length === 0 ? (
        <div className="text-center p-4">
          No maps found for selected filters.
        </div>
      ) : (
        <div className="space-y-6 px-2 md:px-0">
          {serversByMap.sortedMaps.map((map: MapItem) => {
            const servers = serversByMap.serversByMap[map.id] || [];

            return (
              <div key={map.id} className="mb-8 last:mb-0">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    <HighlightText
                      text={String(map.id || '')}
                      searchQuery={searchQuery || ''}
                    />
                  </span>
                  <Badge
                    variant={servers.length > 0 ? 'secondary' : 'outline'}
                    className="font-normal text-sm"
                  >
                    {servers.length} servers
                  </Badge>
                  <span className="text-base text-muted-foreground">
                    <HighlightText
                      text={String(map.name || '')}
                      searchQuery={searchQuery || ''}
                    />
                  </span>
                </div>

                {servers.length > 0 && (
                  <div className="space-y-2">
                    {servers.map((server) => (
                      <ServerItem
                        key={`${server.ipAddress}:${server.port}`}
                        server={server}
                        expanded={
                          !!expandedServers[
                            `${server.ipAddress}:${server.port}`
                          ]
                        }
                        onToggle={() =>
                          toggleServerExpand(
                            `${server.ipAddress}:${server.port}`,
                          )
                        }
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
