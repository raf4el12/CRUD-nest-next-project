import { z } from "zod";

export const productBaseSchema = z.object({
  name: z.string().min(2, { message: "Nombre requerido" }).max(120),
  description: z.string().max(500).optional().or(z.literal("")),
  price: z.coerce.number().min(0, { message: "Precio inválido" }),
  categoryId: z
    .coerce
    .number()
    .int()
    .positive({ message: "Categoría inválida" })
    .optional()
    .or(z.nan().transform(() => undefined)),
  image: z.string().url({ message: "URL inválida" }).optional().or(z.literal("")),
  isAvailable: z.boolean().optional().default(true),
});

export const productCreateSchema = productBaseSchema;
export const productEditSchema = productBaseSchema;

export type ProductFormValues = z.infer<typeof productBaseSchema>;
