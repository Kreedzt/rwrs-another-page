import React from 'preact/compat';
import { useIntl } from 'react-intl';
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
  onColumnToggle: (columnId: string, checked: boolean) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
  columnsList,
  columnVisibility,
  onColumnToggle,
}) => {
  const intl = useIntl();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="ml-2" variant="outline">
          {intl.formatMessage({ id: "app.columns.button", defaultMessage: "Columns" })}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          {intl.formatMessage({ id: "app.columns.toggle", defaultMessage: "Toggle visible columns" })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnsList.map((c) => (
          <DropdownMenuCheckboxItem
            key={c.id}
            checked={columnVisibility[c.id]}
            onCheckedChange={(checked: boolean) => onColumnToggle(c.id, checked)}
          >
            {intl.formatMessage({
              id: `app.column.${c.id.toLowerCase()}`,
              defaultMessage: c.title
            })}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
