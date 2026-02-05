'use client';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Product } from "../types";
import { productsService } from "../services/products.service";
import { productEditSchema } from "../validators/product";
import type { ProductFormValues } from "../validators/product";

interface UseProductEditHookProps {
  product: Product;
}

export function useProductEditHook({ product }: UseProductEditHookProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productEditSchema) as never,
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      categoryId: product.categoryId ?? undefined,
      image: product.image ?? "",
      isAvailable: product.isAvailable,
    },
  }) as UseFormReturn<ProductFormValues>;

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await productsService.updateProduct(product.id, data);
      toast.success("Producto actualizado");
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el producto");
    }
  };

  return {
    form,
    open,
    setOpen,
    onSubmit,
    isPending,
  };
}
