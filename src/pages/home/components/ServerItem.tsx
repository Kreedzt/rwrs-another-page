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
  const openUrl = `steam://rungameid/270150//server_address=${server.ipAddress} server_port=${server.port}`;

  return (
    <section className="border rounded-lg p-4 bg-card">
      <header
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
        aria-expanded={expanded}
        role="button"
        tabIndex={0}
      >
        <div>
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
        <div className="flex items-center gap-2">
          <a
            href={openUrl}
            className="text-sm text-blue-500 hover:underline hidden md:block"
            aria-label={`Join server ${server.name}`}
          >
            Join
          </a>
          <ChevronDownIcon
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              expanded ? 'transform rotate-180' : '',
            )}
            aria-hidden="true"
          />
        </div>
      </header>
      
      {expanded && (
        <div className="mt-4 space-y-2" aria-label="Server details">
          <dl className="grid grid-cols-2 gap-2">
            <div>
              <dt className="text-sm text-muted-foreground inline">IP: </dt>
              <dd className="inline">
                <HighlightText
                  text={server.ipAddress}
                  searchQuery={searchQuery}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground inline">Port: </dt>
              <dd className="inline">
                <HighlightText
                  text={server.port.toString()}
                  searchQuery={searchQuery}
                />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground inline">Country: </dt>
              <dd className="inline">
                <HighlightText text={server.country} searchQuery={searchQuery} />
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground inline">Bots: </dt>
              <dd className="inline">{server.bots}</dd>
            </div>
          </dl>
          
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
                rel="noopener noreferrer"
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
              <h3 className="text-sm text-muted-foreground">Players:</h3>
              <ul className="flex flex-wrap gap-1 mt-1">
                {server.playerList
                  .filter(
                    (player) => typeof player === 'string' && player.length > 0,
                  )
                  .slice(0, 15) // Limit displayed players to reduce DOM size
                  .map((player, idx) => (
                    <li key={idx}>
                      <Badge>
                        <HighlightText
                          text={player.toString()}
                          searchQuery={searchQuery}
                        />
                      </Badge>
                    </li>
                  ))}
                {server.playerList.length > 15 && (
                  <li>
                    <Badge variant="outline">
                      +{server.playerList.length - 15} more
                    </Badge>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
