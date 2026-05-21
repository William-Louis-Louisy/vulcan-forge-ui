import { z } from 'zod';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const themeModeSchema = z.enum(['light', 'dark']);

export const themeSchema = z.object({
  mode: themeModeSchema,
  name: z.string().trim().min(1, { message: 'themeNameRequired' }),
  tokens: z.record(z.string(), jsonValueSchema),
});

export type ThemeMode = z.infer<typeof themeModeSchema>;
export type ThemeSeed = z.infer<typeof themeSchema>;
