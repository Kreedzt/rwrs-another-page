import React, { useState } from 'preact/compat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns, Payment } from './columns';
import { DataList } from './data-list';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableData, setTableData] = useState<Payment[]>([
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '489e1d42',
      amount: 125,
      status: 'processing',
      email: 'example@gmail.com',
    },
  ]);

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
          placeholder="Enter search query"
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
