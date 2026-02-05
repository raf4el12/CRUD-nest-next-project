'use client';

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
import { Form } from "@/shared/ui/form";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import type { ProductFormValues } from "../validators/product";
import { ProductInformationCard } from "./ProductInformationCard";
import { ProductPricingCard } from "./ProductPricingCard";
import { ProductOrganizeCard } from "./ProductOrganizeCard";
import type { Category } from "@/features/categories/types";
import Pencil from "lucide-react/dist/esm/icons/pencil";

interface ProductEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => void;
  isSubmitting: boolean;
  productName?: string;
  trigger?: React.ReactNode;
  categories?: Category[];
}

export function ProductEditDrawer({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
  productName,
  trigger,
  categories = [],
}: ProductEditDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent className="w-full sm:max-w-xl h-dvh p-0 flex flex-col overflow-hidden">
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Pencil className="h-5 w-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg">Editar Producto</SheetTitle>
              <SheetDescription>
                {productName || "Modifica la información del producto"}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 min-h-0 px-6">
          <Form {...form}>
            <form 
              id="product-edit-form"
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6 py-6"
            >
              {/* Product Information */}
              <ProductInformationCard form={form} />

              {/* Pricing & Availability */}
              <ProductPricingCard form={form} />

              {/* Category */}
              <ProductOrganizeCard form={form} categories={categories} />
            </form>
          </Form>
        </ScrollArea>

        <Separator />

        {/* Footer Actions */}
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
            form="product-edit-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
