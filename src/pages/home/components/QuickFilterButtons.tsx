import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { IDisplayServerItem } from '@/models/data-table.model';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface QuickFilterButtonsProps {
  isLoading: boolean;
  onQuickFilter: (query: string) => void;
  activeFilter: string[];
  isMultiSelect: boolean;
  onMultiSelectChange: (checked: boolean) => void;
}

const CASTLING_REGEX = /^\[Castling](\[Global])?\[[\w!\\?]+(-\d)?\s(LV\d|FOV)]/;
const HELDDIVERS_REGEX = /^\[地狱潜兵]/;

export const filters = [
  {
    id: 'invasion',
    label: 'Offical Invasion',
    filter: (data: IDisplayServerItem) => {
      return data.realm === 'official_invasion';
    },
  },
  {
    id: 'ww2_invasion',
    label: 'Offical WW2 Invasion',
    filter: (data: IDisplayServerItem) => {
      return data.realm === 'official_pacific';
    },
  },
  {
    id: 'dominance',
    label: 'Offical Dominance',
    filter: (data: IDisplayServerItem) => {
      return data.realm === 'official_dominance';
    },
  },
  {
    id: 'castling',
    label: 'Offical Mod Castling',
    filter: (data: IDisplayServerItem) => {
      return (
        data.mode.toLowerCase().includes('castling') &&
        CASTLING_REGEX.test(data.name)
      );
    },
  },
  {
    id: 'helldivers',
    label: 'Offical Mod HellDivers',
    filter: (data: IDisplayServerItem) => {
      return (
        data.mode.toLowerCase().includes('hd') &&
        HELDDIVERS_REGEX.test(data.name)
      );
    },
  },
];

export const QuickFilterButtons: React.FC<QuickFilterButtonsProps> = ({
  isLoading,
  onQuickFilter,
  activeFilter,
  isMultiSelect,
  onMultiSelectChange,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={isMultiSelect}
          onCheckedChange={onMultiSelectChange}
          disabled={isLoading}
        />
        <Label className="text-sm">Multiple Select</Label>
      </div>
      <div className="flex gap-2 flex-wrap" id="quick-filter-buttons">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            size="sm"
            variant={activeFilter.includes(filter.id) ? 'default' : 'outline'}
            className={
              activeFilter.includes(filter.id)
                ? 'font-bold border-2 border-primary shadow-xs'
                : ''
            }
            disabled={isLoading}
            onClick={() => onQuickFilter(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
