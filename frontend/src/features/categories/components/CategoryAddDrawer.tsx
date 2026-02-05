import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { CategoryFormValues } from "../validators/category";
import Tags from "lucide-react/dist/esm/icons/tags";

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
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tags className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg">Nueva categoría</SheetTitle>
              <SheetDescription>
                Crea una nueva categoría para organizar tu catálogo
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 px-6 py-6">
          <Form {...form}>
            <form
              id="category-add-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
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
            </form>
          </Form>
        </div>

        <Separator />

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="category-add-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Crear categoría"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
