import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategoryFormValues } from "@/lib/validators/category";

interface CategoryEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
  categoryName?: string;
  trigger?: React.ReactNode;
}

export function CategoryEditDrawer({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  categoryName,
  trigger,
}: CategoryEditDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent className="w-full max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar categoría</SheetTitle>
          {categoryName ? (
            <p className="text-sm text-muted-foreground">{categoryName}</p>
          ) : null}
        </SheetHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
