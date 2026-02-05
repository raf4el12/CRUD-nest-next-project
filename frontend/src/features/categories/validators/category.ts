import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, { message: "Nombre requerido" }).max(80),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
