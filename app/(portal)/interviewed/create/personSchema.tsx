import { z } from "zod";

export const schemaObject = {
  code: z
    .string()
    .trim()
    .min(6)
    .max(6, { message: "Must be 5 or fewer characters long" }),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
};

export const schema = z.object(schemaObject);
