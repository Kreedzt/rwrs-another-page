import * as React from 'preact/compat';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'preact/compat';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// 预计算静态样式
const STATIC_STYLES = {
  base: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
} as const;

const Input = memo(React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // 使用 useMemo 缓存类名计算结果
    const inputClassName = useMemo(() => 
      cn(STATIC_STYLES.base, className),
      [className]
    );

    return (
      <input
        type={type}
        className={inputClassName}
        ref={ref}
        {...props}
      />
    );
  }
));

Input.displayName = 'Input';

export { Input };
