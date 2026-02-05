'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form';
import type { ProductFormValues } from '../validators/product';

interface ProductInformationCardProps {
  form: UseFormReturn<ProductFormValues>;
  className?: string;
}

export function ProductInformationCard({ form, className }: ProductInformationCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Información del Producto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Producto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: iPhone 15 Pro Max" />
              </FormControl>
              <FormDescription>
                Nombre descriptivo y único para el producto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe las características principales del producto..."
                  className="min-h-[120px] resize-y"
                />
              </FormControl>
              <FormDescription>
                Descripción detallada del producto (máx. 500 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Imagen</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </FormControl>
              <FormDescription>
                Enlace a la imagen principal del producto
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
