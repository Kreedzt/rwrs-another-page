import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'preact/compat';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rootClassName?: string;
}

// 预计算静态样式
const STATIC_STYLES = {
  root: 'relative',
  icon: 'absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
  input: 'pl-8',
} as const;

// 使用 memo 包装组件以避免不必要的重渲染
export const SearchInput = memo(
  ({ className, placeholder, ...props }: SearchInputProps) => {
    // 使用 useMemo 缓存类名计算结果
    const rootClassName = useMemo(
      () => cn(STATIC_STYLES.root, props.rootClassName),
      [props.rootClassName],
    );

    const inputClassName = useMemo(
      () => cn(STATIC_STYLES.input, className),
      [className],
    );

    // 优化占位符文本
    const optimizedPlaceholder = useMemo(
      () => placeholder || 'Search...',
      [placeholder],
    );

    return (
      <div className={rootClassName}>
        <Search className={STATIC_STYLES.icon} aria-hidden="true" />
        <Input
          {...props}
          className={inputClassName}
          placeholder={optimizedPlaceholder}
          // 添加性能优化相关的属性
          autoComplete="off"
          spellcheck={false}
          // 添加输入优化
          enterKeyHint="search"
          inputMode="search"
          // 移除可能导致placeholder隐藏的data属性
          aria-label={optimizedPlaceholder}
        />
      </div>
    );
  },
);
