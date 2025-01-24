import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rootClassName?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  const rootClassName = cn('relative', props.rootClassName);

  return (
    <div className={rootClassName}>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        className={`pl-8 ${className}`}
        placeholder={props.placeholder || 'Search...'}
      />
    </div>
  );
}
