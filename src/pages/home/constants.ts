import { columns } from './components/Columns';

export const COLUMNS_LIST: Array<{ id: string; title: string }> = columns.map(
  (c) => ({
    id: (c as any).accessorKey,
    title: typeof c.header === 'string' ? c.header : String(c.header),
  }),
);

export const INITIAL_COLUMNS_VISIBILITY = {
  name: true,
  mapName: true,
  mode: true,
  playerCount: true,
  playerList: true,
  ipAddress: true,
  port: true,
  map_name: true,
  bots: true,
  country: true,
  current_players: true,
  dedicated: false,
  mod: false,
  // player_list: true,
  comment: false,
  url: false,
  realm: false,
  version: false,
  timestamp: true,
};

export const DEFAULT_PAGE_SIZE = 20;
