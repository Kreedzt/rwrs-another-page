import { columns } from './components/Columns';

export const COLUMNS_LIST: Array<{ id: string; title: string }> = columns.map(
  (c) => ({
    id: c.id!,
    title: typeof c.header === 'string' ? c.header : String(c.header),
  }),
);

export const INITIAL_COLUMNS_VISIBILITY: Record<string, boolean> = {
  name: true,
  ip_address: true,
  port: true,
  map_name: true,
  bots: true,
  country: true,
  current_players: true,
  dedicated: false,
  mod: false,
  player_list: true,
  comment: false,
  url: false,
  mode: true,
  realm: false,
  version: false,
  action: true,
};

export const DEFAULT_PAGE_SIZE = 20;
