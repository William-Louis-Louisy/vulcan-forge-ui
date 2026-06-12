import { z } from 'zod';
import { designTokenReferenceSchema } from '@/domain/design-system';

export const createColorTokenKindSchema = z.enum(['primitive', 'semantic']);

export const createColorTokenSchema = z
  .object({
    kind: createColorTokenKindSchema,
    path: z
      .string()
      .trim()
      .min(1, { message: 'tokenPathRequired' })
      .regex(/^[a-zA-Z0-9._-]+$/, {
        message: 'tokenPathInvalid',
      }),
    value: z.string().trim().min(1, { message: 'tokenValueRequired' }),
    referencePath: z.string().trim().optional(),
    descriptionEn: z.string().trim().optional(),
    descriptionFr: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    if (value.kind === 'primitive') {
      if (
        !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.value)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['value'],
          message: 'tokenColorValueInvalid',
        });
      }

      return;
    }

    if (!value.referencePath) {
      context.addIssue({
        code: 'custom',
        path: ['referencePath'],
        message: 'tokenReferenceRequired',
      });

      return;
    }

    const reference = `{${value.referencePath}}`;
    const parsedReference = designTokenReferenceSchema.safeParse(reference);

    if (!parsedReference.success) {
      context.addIssue({
        code: 'custom',
        path: ['referencePath'],
        message: 'tokenReferenceInvalid',
      });
    }
  });

export type CreateColorTokenInput = z.infer<typeof createColorTokenSchema>;

export type CreateColorTokenValidationMessageKey =
  | 'tokenPathRequired'
  | 'tokenPathInvalid'
  | 'tokenValueRequired'
  | 'tokenColorValueInvalid'
  | 'tokenReferenceRequired'
  | 'tokenReferenceInvalid';
