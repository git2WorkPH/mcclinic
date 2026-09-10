import { z } from 'zod';
const configSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().min(1).default('127.0.0.1'),
});
export function readConfig(input: Record<string, string | undefined>) {
  const result = configSchema.safeParse(input);
  if (!result.success) throw new Error('Invalid server configuration');
  return result.data;
}
