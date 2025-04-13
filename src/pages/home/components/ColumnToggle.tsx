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
import { COLUMNS_VISIBILITY_I18N_KEYS } from '../constants';

interface ColumnToggleProps {
  columnVisibility: Record<string, boolean>;
  onColumnToggle: (columnId: string, checked: boolean) => void;
}

export const ColumnToggle: React.FC<ColumnToggleProps> = ({
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
        {Object.keys(columnVisibility).map((columnId) => (
          <DropdownMenuCheckboxItem
            key={columnId}
            checked={columnVisibility[columnId]}
            onCheckedChange={(checked: boolean) => onColumnToggle(columnId, checked)}
          >
            {intl.formatMessage({
              id: COLUMNS_VISIBILITY_I18N_KEYS[columnId as keyof typeof COLUMNS_VISIBILITY_I18N_KEYS],
              defaultMessage: columnId
            })}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
