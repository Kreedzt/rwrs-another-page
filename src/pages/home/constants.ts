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

export const DEFAULT_PAGE_SIZE = 20;
