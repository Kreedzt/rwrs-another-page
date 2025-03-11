import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface ColumnToggleProps {
  columnsList: Array<{ id: string; title: string }>;
  columnVisibility: Record<string, boolean>;
  onColumnToggle: (columnId: string) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columnsList,
  columnVisibility,
  onColumnToggle,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-2" variant="outline">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Toggle visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnsList.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.id}
            checked={columnVisibility[c.id]}
            onClick={() => onColumnToggle(c.id)}
          >
            {c.title}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};