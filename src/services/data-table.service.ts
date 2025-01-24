import { request } from '@/lib/request';
import { IDisplayServerItem } from '@/models/data-table.model';
import { parseServerListFromString } from '@/share/utils';

const SERVER_API_URL = '/api/rwr_server_list';

interface IDataTableListParams {
  start: number;
  size: number;
  names: 1 | 0;
}
interface IDataTableService {
  list(params?: IDataTableListParams): Promise<IDisplayServerItem[]>;
  listAll(): Promise<IDisplayServerItem[]>;
}

export const DataTableService: IDataTableService = {
  async list(params) {
    const queryParams = {
      start: params?.start ?? 0,
      size: params?.size ?? 20,
      names: params?.names ?? 1,
    };

    const url = `${SERVER_API_URL}/get_server_list.php?start=${queryParams.start}&size=${queryParams.size}&names=${queryParams.names}`;

    return request<string>(url, {}, 'text').then((data) => {
      return parseServerListFromString(data);
    });
  },
  async listAll() {
    let start = 0;
    const size = 100;

    const totalServerList: IDisplayServerItem[] = [];

    let parsedServerList: IDisplayServerItem[] = [];

    do {
      const newServerList = await DataTableService.list({
        start,
        size,
        names: 1,
      });

      totalServerList.push(...newServerList);
      start += size;
    } while (parsedServerList.length === size);

    console.info('Total servers:', totalServerList);

    return totalServerList;
  },
};
