import React, { useEffect, useState } from 'preact/compat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns } from './columns';
import { DataList } from './data-list';
import { DataTableService } from '@/services/data-table.service';
import { IDisplayServerItem } from '@/models/data-table.model';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableData, setTableData] = useState<IDisplayServerItem[]>([]);

  useEffect(() => {
    DataTableService.listAll().then((data) => {
      setTableData(data);
    });
  }, []);

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div class="container">
      <h1>RWRS Another Page</h1>
      <div class="search-container">
        <Input
          type="text"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
          placeholder={`Enter search query`}
        ></Input>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div class="table-container">
        <DataList columns={columns} data={tableData} />
      </div>
    </div>
  );
};

export default Home;
