import { request } from '@/lib/request';
import { IDataTableItem } from '@/models/data-table.model';
import { MOCK_DATA_TABLE_ITEMS } from './mock-data';

interface IDataTableService {
  list(): Promise<IDataTableItem[]>;
}

interface IDataTableListParams {
    page: number;
    pageSize: number;
    search: string;
}

export const DataTableService: IDataTableService = {
  async list() {
    // return request<IDataTableItem[]>('/list');
    return MOCK_DATA_TABLE_ITEMS;
  },
};
