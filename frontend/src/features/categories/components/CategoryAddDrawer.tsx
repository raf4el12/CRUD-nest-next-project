import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { CategoryFormValues } from "../validators/category";

interface CategoryAddDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => void;
  isSubmitting: boolean;
  trigger?: React.ReactNode;
}

export function CategoryAddDrawer({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  trigger,
}: CategoryAddDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent className="w-full max-w-lg">
        <SheetHeader>
          <SheetTitle>Nueva categoría</SheetTitle>
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
                      <Input placeholder="Ej. Tecnología" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Crear categoría"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
