'use client';

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categoriesService } from "../services/categories.service";
import { categorySchema } from "../validators/category";
import type { CategoryFormValues } from "../validators/category";

export function useCategoryAddHook() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      await categoriesService.createCategory(data);
      toast.success("Categoría creada correctamente");
      form.reset();
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear la categoría");
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
