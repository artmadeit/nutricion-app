import { z } from "zod";

export const schemaObject = {
  code: z
    .string()
    .trim()
    .length(6),
  firstName: z.string().trim().nonempty(),
  lastName: z.string().trim().nonempty(),
};

export const schema = z.object(schemaObject);
