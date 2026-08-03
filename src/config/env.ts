import { z } from "zod";

const databaseSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("mysql://"),
});

const authSchema = z.object({
  AUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

const s3Schema = z.object({
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET_NAME: z.string().min(1),
  S3_PUBLIC_BASE_URL: z.string().url(),
});

const emailSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  APP_URL: z.string().url(),
});

const stripeSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  APP_URL: z.string().url(),
});

export function getDatabaseEnv() {
  return databaseSchema.parse(process.env);
}

export function getAuthEnv() {
  return authSchema.parse(process.env);
}

export function getS3Env() {
  return s3Schema.parse(process.env);
}

export function getEmailEnv() {
  return emailSchema.parse(process.env);
}

export function getStripeEnv() {
  return stripeSchema.parse(process.env);
}
