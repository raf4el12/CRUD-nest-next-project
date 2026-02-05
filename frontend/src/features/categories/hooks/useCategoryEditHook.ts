'use client';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { Category } from "../types";
import { categoriesService } from "../services/categories.service";
import { categorySchema } from "../validators/category";
import type { CategoryFormValues } from "../validators/category";

interface UseCategoryEditHookProps {
  category: Category;
}

export function useCategoryEditHook({ category }: UseCategoryEditHookProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await categoriesService.updateCategory(category.id, data);
      toast.success("Categoría actualizada");
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar la categoría");
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
