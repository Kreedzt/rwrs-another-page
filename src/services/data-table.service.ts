import { IDisplayServerItem } from '@/models/data-table.model';
import { parseServerListFromString } from '@/share/utils';

const SERVER_API_URL = '/api/rwr_server_list';

interface IDataTableService {
  list(): Promise<IDisplayServerItem[]>;
}

interface IDataTableListParams {
  page: number;
  pageSize: number;
  search: string;
}

export const DataTableService: IDataTableService = {
  async list(params?: { start: number; size: number; names: 1 | 0 }) {
    const queryParams = {
      start: params?.start ?? 0,
      size: params?.size ?? 20,
      names: params?.names ?? 1,
    };

    const url = `${SERVER_API_URL}/get_server_list.php?start=${queryParams.start}&size=${queryParams.size}&names=${queryParams.names}`;
    // return MOCK_DATA_TABLE_ITEMS;

    return fetch(url)
      .then((res) => res.text())
      .then((data) => {
        return parseServerListFromString(data);
      });
  },
};
