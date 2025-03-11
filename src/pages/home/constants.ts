import { columns } from './columns';

export const COLUMNS_LIST = columns.map((c) => ({
  id: c.id,
  title: c.header,
}));

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
