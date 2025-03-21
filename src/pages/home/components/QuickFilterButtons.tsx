import React from 'preact/compat';
import { Button } from '@/components/ui/button';
import { IDisplayServerItem } from '@/models/data-table.model';

interface QuickFilterButtonsProps {
  isLoading: boolean;
  onQuickFilter: (query: string) => void;
  activeFilter: string[];
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
}) => {
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          size="sm"
          variant={activeFilter.includes(filter.id) ? 'secondary' : 'outline'}
          disabled={isLoading}
          onClick={() => onQuickFilter(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
