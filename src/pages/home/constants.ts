import { columns } from './components/Columns';

export const COLUMNS_LIST: Array<{ id: string; title: string }> = columns.map(
  (c) => ({
    id: c.id!,
    title: typeof c.header === 'string' ? c.header : String(c.header),
  }),
);

export const INITIAL_COLUMNS_VISIBILITY = {
  name: true,
  ipAddress: true,
  port: true,
  bots: true,
  country: false,
  mode: true,
  mapId: true,
  playerCount: true,
  playerList: true,
  comment: false,
  dedicated: false,
  url: false,
  version: false,
  timestamp: true,
  mod: false,
};

export const DEFAULT_PAGE_SIZE = 20;
