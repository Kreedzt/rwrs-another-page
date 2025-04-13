import { getColumns } from './components/Columns';
import { createIntl, createIntlCache } from 'react-intl';

// 创建一个默认的 intl 实例用于初始化列定义
const cache = createIntlCache();
const intl = createIntl({
  locale: 'en',
  messages: {}
}, cache);

// 使用默认的 intl 实例获取列定义
const columns = getColumns(intl);

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

export const COLUMNS_VISIBILITY_I18N_KEYS: Record<keyof typeof INITIAL_COLUMNS_VISIBILITY, string> = {
  name: 'app.column.name',
  ipAddress: 'app.column.ip',
  port: 'app.column.port',
  bots: 'app.column.bots',
  country: 'app.column.country',
  mode: 'app.column.mode',
  mapId: 'app.column.map',
  playerCount: 'app.column.capacity',
  playerList: 'app.column.players',
  comment: 'app.column.comment',
  dedicated: 'app.column.dedicated',
  url: 'app.column.url',
  version: 'app.column.version',
  timestamp: 'app.column.timestamp',
  mod: 'app.column.mod',
}

export const DEFAULT_PAGE_SIZE = 20;
