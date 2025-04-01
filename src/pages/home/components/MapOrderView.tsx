import React, { useMemo, useState, useCallback } from 'preact/compat';
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
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
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
            <a href={openUrl} target="_blank" rel="noopener noreferrer" aria-label={`Join server ${serverName}`}>
              Join
            </a>
          </Button>
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-border/50">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <dt className="text-sm font-medium inline">IP:</dt>{' '}
                <dd className="inline">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <HighlightText
                      text={`${server.ipAddress}`}
                      searchQuery={searchQuery || ''}
                    />
                  </Button>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium inline">Port:</dt>{' '}
                <dd className="inline">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <HighlightText
                      text={`${server.port}`}
                      searchQuery={searchQuery || ''}
                    />
                  </Button>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium inline">Version:</dt>{' '}
                <dd className="inline text-sm text-muted-foreground">
                  <HighlightText
                    text={serverVersion}
                    searchQuery={searchQuery || ''}
                  />
                </dd>
              </div>
            </div>
            <div className="space-y-2">
              {server.url && (
                <div>
                  <dt className="text-sm font-medium inline">URL:</dt>{' '}
                  <dd className="inline">
                    <a
                      href={server.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline truncate"
                    >
                      <HighlightText
                        text={serverUrl}
                        searchQuery={searchQuery || ''}
                      />
                    </a>
                  </dd>
                </div>
              )}
              {server.comment && (
                <div>
                  <dt className="text-sm font-medium inline">Comment:</dt>{' '}
                  <dd className="inline text-sm text-muted-foreground">
                    <HighlightText
                      text={serverComment}
                      searchQuery={searchQuery || ''}
                    />
                  </dd>
                </div>
              )}
            </div>
          </dl>

          {server.playerList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Players</h4>
                <span className="text-sm text-muted-foreground">
                  {server.playerList.length} online
                </span>
              </div>
              {server.playerList.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {server.playerList.slice(0, 10).map((player) => (
                    <li key={player}>
                      <Badge
                        variant="secondary"
                        className="font-normal text-xs"
                      >
                        <HighlightText
                          text={String(player || '')}
                          searchQuery={searchQuery || ''}
                        />
                      </Badge>
                    </li>
                  ))}
                  {server.playerList.length > 10 && (
                    <li>
                      <Badge variant="outline" className="font-normal text-xs">
                        +{server.playerList.length - 10} more
                      </Badge>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No players online
                </div>
              )}
            </div>
          )}
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
  
  // State to track which maps are expanded
  const [expandedMaps, setExpandedMaps] = useState<Record<string, boolean>>({});

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

  const toggleServerExpand = useCallback((serverId: string) => {
    setExpandedServers((prev) => ({
      ...prev,
      [serverId]: !prev[serverId],
    }));
  }, []);
  
  const toggleMapExpand = useCallback((mapId: string) => {
    setExpandedMaps((prev) => ({
      ...prev,
      [mapId]: !prev[mapId],
    }));
  }, []);

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

  // Limit visible maps to reduce DOM size
  const visibleMaps = serversByMap.sortedMaps.filter(map => 
    serversByMap.serversByMap[map.id]?.length > 0
  ).slice(0, 10);
  
  const hasMoreMaps = serversByMap.sortedMaps.length > 10;

  return (
    <div className="flex flex-col w-full overflow-x-auto">
      <header className="text-lg font-semibold mb-4 px-2 md:px-0">
        Map Order: {filterNames || 'All Maps'}
      </header>

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
          {visibleMaps.map((map: MapItem) => {
            const servers = serversByMap.serversByMap[map.id] || [];
            const isMapExpanded = !!expandedMaps[map.id];
            
            if (servers.length === 0) return null;

            return (
              <section key={map.id} className="mb-8 last:mb-0">
                <div 
                  className="flex flex-wrap items-center gap-2 mb-4 cursor-pointer" 
                  onClick={() => toggleMapExpand(map.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isMapExpanded}
                >
                  <h2 className="text-2xl font-bold text-primary">
                    <HighlightText
                      text={String(map.id || '')}
                      searchQuery={searchQuery || ''}
                    />
                  </h2>
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
                  {isMapExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>

                {isMapExpanded && servers.length > 0 && (
                  <div className="space-y-2">
                    {servers.slice(0, 5).map((server) => (
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
                    {servers.length > 5 && (
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // This is a placeholder - in a real implementation,
                          // you would load more servers or navigate to a view with all servers
                        }}
                      >
                        Show {servers.length - 5} more servers
                      </Button>
                    )}
                  </div>
                )}
              </section>
            );
          })}
          
          {hasMoreMaps && (
            <Button variant="outline" className="w-full">
              Show more maps
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
