'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import type { ProductFormValues } from '../validators/product';

interface Category {
  id: number;
  name: string;
}

interface ProductOrganizeCardProps {
  form: UseFormReturn<ProductFormValues>;
  categories?: Category[];
  className?: string;
}

export function ProductOrganizeCard({
  form,
  categories = [],
  className,
}: ProductOrganizeCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Organización</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select
                value={field.value?.toString() || ''}
                onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
