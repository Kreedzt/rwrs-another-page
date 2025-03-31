import React from 'preact/compat';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HighlightText } from '@/components/custom/highlight-text';
import type { ServerItemProps } from '../types';

export const ServerItem: React.FC<ServerItemProps> = ({
  server,
  expanded,
  onToggle,
  searchQuery,
}) => {
  const lastMapId = server.mapId.split('/').pop();

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex flex-col">
          <h2 className="font-medium">
            <HighlightText text={server.name} searchQuery={searchQuery} />
          </h2>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">
              <HighlightText text={server.mode} searchQuery={searchQuery} />
            </Badge>
            <Badge variant="outline">
              <HighlightText text={lastMapId || ''} searchQuery={searchQuery} />
            </Badge>
            <span className="text-muted-foreground">
              {server.currentPlayers} / {server.maxPlayers}
            </span>
          </div>
        </div>
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            expanded ? 'transform rotate-180' : '',
          )}
        />
      </div>
      {expanded && (
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-sm text-muted-foreground">IP: </span>
              <HighlightText
                text={server.ipAddress}
                searchQuery={searchQuery}
              />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Port: </span>
              <HighlightText
                text={server.port.toString()}
                searchQuery={searchQuery}
              />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Country: </span>
              <HighlightText text={server.country} searchQuery={searchQuery} />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Bots: </span>
              {server.bots}
            </div>
          </div>
          {server.comment && (
            <div>
              <span className="text-sm text-muted-foreground">Comment: </span>
              <HighlightText text={server.comment} searchQuery={searchQuery} />
            </div>
          )}
          {server.url && (
            <div>
              <span className="text-sm text-muted-foreground">URL: </span>
              <a
                href={server.url}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                <HighlightText text={server.url} searchQuery={searchQuery} />
              </a>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Version: </span>
            <HighlightText
              text={server.version.toString()}
              searchQuery={searchQuery}
            />
          </div>
          {server.playerList.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Players:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {server.playerList
                  .filter(
                    (player) => typeof player === 'string' && player.length > 0,
                  )
                  .map((player, idx) => (
                    <Badge key={idx}>
                      <HighlightText
                        text={player.toString()}
                        searchQuery={searchQuery}
                      />
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
