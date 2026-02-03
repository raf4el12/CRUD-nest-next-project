'use client';

import { useState, useTransition } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { productsService } from "../services/products.service";
import { productCreateSchema, ProductFormValues } from "../validators/product";

export function useProductAddHook() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productCreateSchema) as never,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: undefined,
      image: "",
      isAvailable: true,
    },
  }) as UseFormReturn<ProductFormValues>;

  const onSubmit = async (data: ProductFormValues) => {
    try {
      await productsService.createProduct(data);
      toast.success("Producto creado correctamente");
      form.reset();
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear el producto");
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
