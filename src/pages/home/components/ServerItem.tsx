import React from 'preact/compat';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { ServerItemProps } from '../types';

export const ServerItem: React.FC<ServerItemProps> = ({
  server,
  expanded,
  onToggle,
}) => {
  const lastMapId = server.mapId.split('/').pop();

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex flex-col">
          <h3 className="font-medium">{server.name}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">{server.mode}</Badge>
            <Badge variant="outline">{lastMapId}</Badge>
            <span className="text-muted-foreground">
              {server.currentPlayers} / {server.maxPlayers}
            </span>
          </div>
        </div>
        <ChevronDownIcon
          className={cn(
            'h-5 w-5 transition-transform',
            expanded && 'transform rotate-180',
          )}
        />
      </div>

      {expanded && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <span className="font-medium">IP:</span> {server.ipAddress}:
            {server.port}
          </div>
          <div className="text-sm">
            <span className="font-medium">Country:</span> {server.country}
          </div>
          <div className="text-sm">
            <span className="font-medium">Bots:</span> {server.bots}
          </div>
          <div className="text-sm">
            <span className="font-medium">Dedicated:</span>{' '}
            {server.dedicated ? 'Yes' : 'No'}
          </div>
          <div className="text-sm">
            <span className="font-medium">Comment:</span> {server.comment}
          </div>
          <div className="text-sm overflow-hidden">
            <span className="font-medium">URL:</span>{' '}
            <a href={server.url ?? ''} target="_blank" className="text-ellipsis">
              {server.url}
            </a>
          </div>
          <div className="text-sm">
            <span className="font-medium">Version:</span> {server.version}
          </div>
          {server.playerList.length > 0 && (
            <div className="text-sm">
              <span className="font-medium">Player List:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {server.playerList.map((player, idx) => (
                  <Badge key={idx}>{player}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
