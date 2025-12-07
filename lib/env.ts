import { z } from 'zod';

const envSchema = z.object({
  // Next.js
  NEXT_PUBLIC_URL: z.string().url().optional(),
  NEXT_PUBLIC_PROJECT_ID: z.string().min(1),

  // Blockchain
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().startsWith('0x').length(42),
  NEXT_PUBLIC_CHAIN_ID: z.string().or(z.number()).transform(Number),
  NEXT_PUBLIC_RPC_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().url().optional(),

  // External APIs
  NEYNAR_API_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

export function validateEnvironment(): Environment {
  try {
    const env = {
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
      NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
      NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
      NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
      DATABASE_URL: process.env.DATABASE_URL,
      NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    };

    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n');
      throw new Error(`Environment validation failed:\n${missing}`);
    }
    throw error;
  }
}

// Singleton instance
let cachedEnv: Environment | null = null;

export function getEnv(): Environment {
  if (!cachedEnv) {
    cachedEnv = validateEnvironment();
  }
  return cachedEnv;
}
