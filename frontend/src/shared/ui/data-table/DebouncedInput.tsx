'use client';

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import Search from 'lucide-react/dist/esm/icons/search';
import X from 'lucide-react/dist/esm/icons/x';
import { cn } from '@/shared/lib/utils';

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  showSearchIcon?: boolean;
  showClearButton?: boolean;
}

/**
 * Input with debounced onChange for optimized search
 */
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  showSearchIcon = true,
  showClearButton = true,
  className,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  const handleClear = useCallback(() => {
    setValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      {showSearchIcon && (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      )}
      <Input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          showSearchIcon && 'pl-9',
          showClearButton && value && 'pr-9',
          className
        )}
      />
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
