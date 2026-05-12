import 'dotenv/config';

import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().trim().min(1),
  MONGODB_URI: z.string().trim().min(1),
  JWT_SECRET: z.string().trim().min(1),
  JWT_EXPIRES_IN: z.string().trim().min(1),
  FRONTEND_URL: z.string().trim().min(1),
  SENDGRID_API_KEY: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
});

export type ServerEnv = z.infer<typeof schema>;

export const env: ServerEnv = schema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  FRONTEND_URL: process.env.FRONTEND_URL,
  SENDGRID_API_KEY: (process.env.SENDGRID_API_KEY ?? '').trim(),
  TWILIO_ACCOUNT_SID: (process.env.TWILIO_ACCOUNT_SID ?? '').trim(),
  TWILIO_AUTH_TOKEN: (process.env.TWILIO_AUTH_TOKEN ?? '').trim(),
  TWILIO_PHONE_NUMBER: (process.env.TWILIO_PHONE_NUMBER ?? '').trim(),
  GOOGLE_CLIENT_ID: (process.env.GOOGLE_CLIENT_ID ?? '').trim(),
  GOOGLE_CLIENT_SECRET: (process.env.GOOGLE_CLIENT_SECRET ?? '').trim(),
  GOOGLE_CALLBACK_URL: (process.env.GOOGLE_CALLBACK_URL ?? '').trim(),
});

const HTTP_SCHEME = /^https?:\/\//i;

function normalizeCorsOriginPart(part: string): string {
  const trimmed = part.trim();
  if (!trimmed) {
    return '';
  }
  if (HTTP_SCHEME.test(trimmed)) {
    return new URL(trimmed).origin;
  }
  return trimmed;
}

export function corsOrigins(): string | string[] {
  const list = env.FRONTEND_URL.split(',')
    .map(normalizeCorsOriginPart)
    .filter(Boolean);
  if (list.length === 0) {
    throw new Error('FRONTEND_URL must list at least one URL');
  }
  return list.length === 1 ? (list[0] as string) : list;
}

export const {
  PORT,
  DATABASE_URL,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  FRONTEND_URL,
  SENDGRID_API_KEY,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = env;
